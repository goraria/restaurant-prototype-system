import { z } from 'zod';
import { 
  UuidSchema, 
  EmailSchema, 
  PhoneSchema, 
  DecimalSchema 
} from './core';

// ================================
// 👥 STAFF SCHEMAS
// ================================

export const StaffBaseSchema = z.object({
  restaurant_id: UuidSchema,
  user_id: UuidSchema,
  employee_id: z.string().max(20).optional(),
  position: z.string().min(1).max(50),
  department: z.string().max(50).optional(),
  hire_date: z.string().date(),
  salary: DecimalSchema.optional(),
  hourly_rate: DecimalSchema.optional(),
  status: z.enum(['active', 'inactive', 'terminated']).default('active'),
  emergency_contact_name: z.string().max(100).optional(),
  emergency_contact_phone: PhoneSchema.optional(),
  notes: z.string().optional(),
});

export const StaffCreateSchema = StaffBaseSchema;
export const StaffUpdateSchema = StaffBaseSchema.partial().omit({ 
  restaurant_id: true,
  user_id: true 
});

export const StaffSchema = StaffBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ================================
// 📅 STAFF SCHEDULE SCHEMAS
// ================================

export const StaffScheduleBaseSchema = z.object({
  staff_id: UuidSchema,
  shift_date: z.string().date(),
  start_time: z.string().time(),
  end_time: z.string().time(),
  break_start: z.string().time().optional(),
  break_end: z.string().time().optional(),
  position: z.string().max(50).optional(),
  status: z.enum(['scheduled', 'confirmed', 'completed', 'no_show', 'cancelled']).default('scheduled'),
  notes: z.string().optional(),
});

export const StaffScheduleCreateSchema = StaffScheduleBaseSchema;
export const StaffScheduleUpdateSchema = StaffScheduleBaseSchema.partial().omit({ 
  staff_id: true,
  shift_date: true 
});

export const StaffScheduleSchema = StaffScheduleBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ================================
// ⏱️ TIME TRACKING SCHEMAS
// ================================

export const TimeTrackingBaseSchema = z.object({
  staff_id: UuidSchema,
  work_date: z.string().date(),
  clock_in: z.string().datetime(),
  clock_out: z.string().datetime().optional(),
  break_start: z.string().datetime().optional(),
  break_end: z.string().datetime().optional(),
  total_hours: DecimalSchema.optional(),
  overtime_hours: DecimalSchema.default(0),
  notes: z.string().optional(),
  approved_by: UuidSchema.optional(),
  approved_at: z.string().datetime().optional(),
});

export const TimeTrackingCreateSchema = TimeTrackingBaseSchema;
export const TimeTrackingUpdateSchema = TimeTrackingBaseSchema.partial().omit({ 
  staff_id: true,
  work_date: true 
});

export const TimeTrackingSchema = TimeTrackingBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ================================
// 💰 PAYROLL SCHEMAS
// ================================

export const PayrollBaseSchema = z.object({
  staff_id: UuidSchema,
  pay_period_start: z.string().date(),
  pay_period_end: z.string().date(),
  regular_hours: DecimalSchema.default(0),
  overtime_hours: DecimalSchema.default(0),
  regular_pay: DecimalSchema.default(0),
  overtime_pay: DecimalSchema.default(0),
  bonus: DecimalSchema.default(0),
  deductions: DecimalSchema.default(0),
  gross_pay: DecimalSchema.default(0),
  tax_deductions: DecimalSchema.default(0),
  net_pay: DecimalSchema.default(0),
  status: z.enum(['draft', 'processed', 'paid']).default('draft'),
  pay_date: z.string().date().optional(),
  notes: z.string().optional(),
});

export const PayrollCreateSchema = PayrollBaseSchema;
export const PayrollUpdateSchema = PayrollBaseSchema.partial().omit({ 
  staff_id: true,
  pay_period_start: true,
  pay_period_end: true 
});

export const PayrollSchema = PayrollBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ================================
// 🏆 STAFF PERFORMANCE SCHEMAS
// ================================

export const StaffPerformanceBaseSchema = z.object({
  staff_id: UuidSchema,
  review_period_start: z.string().date(),
  review_period_end: z.string().date(),
  reviewer_id: UuidSchema,
  overall_rating: z.number().min(1).max(5),
  punctuality: z.number().min(1).max(5).optional(),
  quality_of_work: z.number().min(1).max(5).optional(),
  teamwork: z.number().min(1).max(5).optional(),
  customer_service: z.number().min(1).max(5).optional(),
  goals_achieved: z.string().optional(),
  areas_for_improvement: z.string().optional(),
  comments: z.string().optional(),
  status: z.enum(['draft', 'completed', 'acknowledged']).default('draft'),
});

export const StaffPerformanceCreateSchema = StaffPerformanceBaseSchema;
export const StaffPerformanceUpdateSchema = StaffPerformanceBaseSchema.partial().omit({ 
  staff_id: true,
  reviewer_id: true 
});

export const StaffPerformanceSchema = StaffPerformanceBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ================================
// 📚 STAFF TRAINING SCHEMAS
// ================================

export const StaffTrainingBaseSchema = z.object({
  staff_id: UuidSchema,
  training_name: z.string().min(1).max(100),
  training_type: z.enum(['orientation', 'safety', 'skills', 'certification', 'other']),
  trainer: z.string().max(100).optional(),
  training_date: z.string().date(),
  completion_date: z.string().date().optional(),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).default('scheduled'),
  score: z.number().min(0).max(100).optional(),
  certification_number: z.string().max(50).optional(),
  expiry_date: z.string().date().optional(),
  notes: z.string().optional(),
});

export const StaffTrainingCreateSchema = StaffTrainingBaseSchema;
export const StaffTrainingUpdateSchema = StaffTrainingBaseSchema.partial().omit({ 
  staff_id: true 
});

export const StaffTrainingSchema = StaffTrainingBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Type exports
export type StaffType = z.infer<typeof StaffSchema>;
export type StaffCreateType = z.infer<typeof StaffCreateSchema>;
export type StaffUpdateType = z.infer<typeof StaffUpdateSchema>;

export type StaffScheduleType = z.infer<typeof StaffScheduleSchema>;
export type StaffScheduleCreateType = z.infer<typeof StaffScheduleCreateSchema>;
export type StaffScheduleUpdateType = z.infer<typeof StaffScheduleUpdateSchema>;

export type TimeTrackingType = z.infer<typeof TimeTrackingSchema>;
export type TimeTrackingCreateType = z.infer<typeof TimeTrackingCreateSchema>;
export type TimeTrackingUpdateType = z.infer<typeof TimeTrackingUpdateSchema>;

export type PayrollType = z.infer<typeof PayrollSchema>;
export type PayrollCreateType = z.infer<typeof PayrollCreateSchema>;
export type PayrollUpdateType = z.infer<typeof PayrollUpdateSchema>;

export type StaffPerformanceType = z.infer<typeof StaffPerformanceSchema>;
export type StaffPerformanceCreateType = z.infer<typeof StaffPerformanceCreateSchema>;
export type StaffPerformanceUpdateType = z.infer<typeof StaffPerformanceUpdateSchema>;

export type StaffTrainingType = z.infer<typeof StaffTrainingSchema>;
export type StaffTrainingCreateType = z.infer<typeof StaffTrainingCreateSchema>;
export type StaffTrainingUpdateType = z.infer<typeof StaffTrainingUpdateSchema>;
