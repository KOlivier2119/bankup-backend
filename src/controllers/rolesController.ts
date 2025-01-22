import { RoleService } from '../services/roleService';
import { Request, Response } from 'express';
import { createRoleType } from '../validators';

export class RolesController {
    public static async getAllRoles(req: Request, res: Response) {
        try {
            const roles = await RoleService.getAllRoles();
            res.status(200).json(roles);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    public static async createRole(req: Request, res: Response) {
        try {
            const role: createRoleType = req.body;
            const existingRole = await RoleService.getRoleByName(role.name);
            if (existingRole) {
                res.status(400).json({ message: 'Role already exists' });
                return;
            }
            const createdRole = await RoleService.createRole(role);
            res.status(201).json({ message: 'Role created successfully', role: createdRole });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public static async deleteRole(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const roleId = parseInt(id);
            const result = await RoleService.deleteRole(roleId);
            res.status(result.status).json({ message: result.message });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}