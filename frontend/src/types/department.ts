export interface Department {
    id: string;
    name: string;
    code: string;
    description?: string;
    headId?: string;
    branchId?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Branch {
    id: string;
    name: string;
    code: string;
    address: string;
    phone: string;
    email?: string;
    managerId?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CostCenter {
    id: string;
    name: string;
    code: string;
    departmentId?: string;
    branchId?: string;
    isActive: boolean;
    createdAt: string;
}
