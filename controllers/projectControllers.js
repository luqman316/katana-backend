import { PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import { S3_BUCKET, s3Client } from "../config/s3.js";
import Project from "../models/project.js";
import { presignKey } from "../utils/presign.js";

// add a new project
export const addProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const files = Array.isArray(req.files) ? req.files : [];

    if (files.length < 1) {
      return res.status(400).json({ message: "At least 1 image is required" });
    }
    if (files.length > 10) {
      return res.status(400).json({ message: "Maximum 10 images allowed" });
    }

    if (!S3_BUCKET) {
      return res.status(500).json({ message: "S3 bucket not configured" });
    }

    // Upload each file buffer to S3 and store S3 URL in DB
    const uploads = await Promise.all(
      files.map(async (file) => {
        const ext = file.originalname.split(".").pop();
        const key = `projects/${Date.now()}-${crypto
          .randomBytes(8)
          .toString("hex")}.${ext}`;
        try {
          await s3Client.send(
            new PutObjectCommand({
              Bucket: S3_BUCKET,
              Key: key,
              Body: file.buffer,
              ContentType: file.mimetype,
            })
          );
        } catch (e) {
          console.error("Single file upload failed", file.originalname, e);
          throw e;
        }
        // S3 public URL
        const url = `https://${S3_BUCKET}.s3.amazonaws.com/${key}`;
        return { key, url };
      })
    );
    const project = new Project({ title, description, images: uploads });
    await project.save();
    return res.status(201).json(project);
  } catch (error) {
    console.error("Add Project Controller Error", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// get all projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    // Map each project's images to presigned URLs; handle both object and string
    const enriched = await Promise.all(
      projects.map(async (p) => {
        const signed = await Promise.all(
          (p.images || []).map(async (img) => {
            // Always use presignKey for key
            if (typeof img === "string") {
              return { key: img, url: await presignKey(img) };
            } else if (img && typeof img === "object" && img.key) {
              return { key: img.key, url: await presignKey(img.key) };
            } else {
              return { key: null, url: "" };
            }
          })
        );
        return { ...p.toObject(), images: signed };
      })
    );
    res.status(200).json(enriched);
  } catch (error) {
    console.error("GetProjects Error", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// find by id
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const signed = await Promise.all(
      (project.images || []).map(async (img) => {
        if (typeof img === "string") {
          return img.startsWith("http")
            ? { key: null, url: img }
            : { key: img, url: await presignKey(img) };
        } else if (img && typeof img === "object" && img.url) {
          return img.url.startsWith("http")
            ? img
            : { key: img.key, url: await presignKey(img.key) };
        } else {
          return { key: null, url: "" };
        }
      })
    );
    res.status(200).json({ ...project.toObject(), images: signed });
  } catch (error) {
    console.error("GetProjectById Error", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// update a project
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// delete a project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
