import { z } from 'zod';

export const ClientSchema = z.object({
  ClientID: z.string().min(1, "ClientID is required"),
  ClientName: z.string().min(1, "ClientName is required"),
  PriorityLevel: z.number().int().min(1).max(5),
  RequestedTaskIDs: z.string(), // comma-separated
  GroupTag: z.string().optional(),
  AttributesJSON: z.string().optional()
});

export const WorkerSchema = z.object({
  WorkerID: z.string().min(1, "WorkerID is required"),
  WorkerName: z.string().min(1, "WorkerName is required"),
  Skills: z.string(), // comma-separated
  AvailableSlots: z.string(), // JSON array format
  MaxLoadPerPhase: z.number().int().min(1),
  WorkerGroup: z.string().optional(),
  QualificationLevel: z.string().optional()
});

export const TaskSchema = z.object({
  TaskID: z.string().min(1, "TaskID is required"),
  TaskName: z.string().min(1, "TaskName is required"),
  Category: z.string().optional(),
  Duration: z.number().int().min(1),
  RequiredSkills: z.string(), // comma-separated
  PreferredPhases: z.string(), // JSON array or range format
  MaxConcurrent: z.number().int().min(1)
}); 