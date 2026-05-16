// FieldSync — Database & domain types

export type UserRole =
  | 'admin_relia'
  | 'presales_rep'
  | 'presales_supervisor'
  | 'cashvan_supervisor'
  | 'regional_manager_roshen'
  | 'trade_marketing_manager'
  | 'top_management_relia'
  | 'top_management_roshen'

export type CustomerChannel = 'TT' | 'WS' | 'DS' | 'MT' | 'SW'
export type CustomerGrade = 'A' | 'B' | 'C' | 'D'
export type VisitType = 'office' | 'branch' | 'cashvan' | 'hybrid'
export type VisitStatus = 'draft' | 'submitted' | 'approved' | 'rejected'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected'
export type PerformanceStatus = 'excellent' | 'good' | 'average' | 'poor'
export type RequestPriority = 'low' | 'medium' | 'high'

// ─── Users ────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  auth_id: string
  full_name: string
  full_name_ar: string | null
  email: string
  role: UserRole
  region: string | null
  supervisor_id: string | null
  phone: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// ─── Customers ────────────────────────────────────────────────────────────────

export interface Customer {
  id: string
  code: string
  name: string
  name_ar: string | null
  channel: CustomerChannel
  grade: CustomerGrade | null
  region: string
  city: string | null
  address: string | null
  lat: number | null
  lng: number | null
  assigned_rep_id: string | null
  total_debt: number
  overdue_amount: number
  credit_limit: number
  last_visit_date: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// ─── Visits ───────────────────────────────────────────────────────────────────

export interface Visit {
  id: string
  customer_id: string
  rep_id: string
  visit_type: VisitType
  visit_date: string
  check_in_time: string | null
  check_out_time: string | null
  lat: number | null
  lng: number | null
  order_amount: number | null
  notes: string | null
  status: VisitStatus
  approved_by: string | null
  created_at: string
  updated_at: string
  customer?: Customer
  rep?: User
}

export interface VisitPhoto {
  id: string
  visit_id: string
  photo_url: string
  photo_type: string | null
  created_at: string
}

export interface VisitReasonMaster {
  id: string
  reason_code: string
  reason_ar: string
  reason_en: string
  is_active: boolean
  sort_order: number
}

// ─── Products ─────────────────────────────────────────────────────────────────

export interface Product {
  id: string
  sku: string
  name: string
  name_ar: string | null
  category: string | null
  unit: string
  price: number | null
  is_active: boolean
}

// ─── Near Expiry ──────────────────────────────────────────────────────────────

export interface NearExpiryRecord {
  id: string
  customer_id: string
  rep_id: string
  product_id: string
  quantity: number
  expiry_date: string
  photo_url: string | null
  notes: string | null
  status: ApprovalStatus
  created_at: string
  updated_at: string
  customer?: Customer
  product?: Product
}

export interface NearExpiryApproval {
  id: string
  near_expiry_id: string
  approver_id: string
  stage: number
  status: ApprovalStatus
  notes: string | null
  created_at: string
}

// ─── Requests ─────────────────────────────────────────────────────────────────

export interface VisitRequest {
  id: string
  customer_id: string
  assigned_to: string
  requested_by: string
  due_date: string | null
  priority: RequestPriority
  notes: string | null
  status: 'pending' | 'accepted' | 'completed' | 'cancelled'
  created_at: string
  customer?: Customer
}

export interface FinancialDataRequest {
  id: string
  customer_id: string
  requested_by: string
  rep_id: string
  expires_at: string
  is_viewed: boolean
  created_at: string
  customer?: Customer
}

// ─── RPC Return Types ─────────────────────────────────────────────────────────

export interface SalesmanDashboard {
  strike_rate: number
  drop_size: number
  coverage_percent: number
  performance_status: PerformanceStatus
  total_visits: number
  total_orders: number
  target_customers: number
  visited_customers: number
}

export interface Customer360 {
  id: string
  code: string
  name: string
  name_ar: string | null
  channel: CustomerChannel
  grade: CustomerGrade | null
  health_score: number
  recommended_action: string
  recommended_action_ar: string
  total_debt: number
  overdue_amount: number
  credit_limit: number
  last_visit_date: string | null
  visit_count_30d: number
  order_amount_30d: number
  lat: number | null
  lng: number | null
  recent_visits: Visit[]
}

// ─── View Types ───────────────────────────────────────────────────────────────

export interface SalesmanPerformanceView {
  rep_id: string
  rep_name: string
  region: string
  strike_rate: number
  drop_size: number
  coverage_percent: number
  total_visits: number
  performance_status: PerformanceStatus
}

export interface OverdueCustomerView {
  customer_id: string
  customer_name: string
  overdue_amount: number
  days_overdue: number
  rep_name: string
}

export interface VisitsTodayView {
  visit_id: string
  customer_name: string
  rep_name: string
  visit_type: VisitType
  check_in_time: string | null
  status: VisitStatus
}
