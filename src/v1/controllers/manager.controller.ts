import { Response, NextFunction } from 'express';
import Services from '../services/index';
import { handleErrorResponse } from '@/utils/error.util';
import RESPONSE_CODES from '@/constant/responseCode';
import MESSAGES from '@/constant/message';
import * as response from '@/utils/response';
import { AuthenticatedRequest } from '@/middlewares/authenticate';
import { EUserStatus } from '../enums/agency.enum';

export const createManager = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, fullName, title, agencyId } = req.body ?? {};
        const createdBy = req.user?.user_id;

        const result = await Services.auth.createManager(createdBy, {
            email,
            fullName,
            title,
            agencyId: agencyId ?? undefined,
        });

        return response.success(req, res, result, RESPONSE_CODES.CREATED, MESSAGES.MANAGER.CREATED);
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

export const listManagers = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const createdBy = req.user?.user_id;
        const result = await Services.auth.listManagers(createdBy);
        return response.success(req, res, result, RESPONSE_CODES.OK, MESSAGES.MANAGER.FETCHED);
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

export const setManagerStatus = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const createdBy = req.user?.user_id;
        const { id } = req.params;
        const { status } = req.body ?? {};

        if (status !== EUserStatus.ACTIVE && status !== EUserStatus.INACTIVE) {
            return response.failed(req, res, RESPONSE_CODES.BAD_REQUEST, 'Status must be active or inactive');
        }

        const result = await Services.auth.setManagerStatus(createdBy, id, status as EUserStatus);
        return response.success(req, res, result, RESPONSE_CODES.OK, MESSAGES.MANAGER.UPDATED);
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

export const resendManagerInvite = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const createdBy = req.user?.user_id;
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const result = await Services.auth.resendManagerInvite(createdBy, id);
        return response.success(req, res, result, RESPONSE_CODES.OK, MESSAGES.MANAGER.INVITE_RESENT);
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

export const assignManagerAgency = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const createdBy = req.user?.user_id;
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { agencyId } = req.body ?? {};

        // agencyId may be a string (assign) or null/undefined (clear)
        const result = await Services.auth.assignManagerAgency(
            createdBy,
            id,
            agencyId ?? null
        );
        return response.success(req, res, result, RESPONSE_CODES.OK, MESSAGES.MANAGER.AGENCY_ASSIGNED);
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

export const deleteManager = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const createdBy = req.user?.user_id;
        const { id } = req.params;
        const result = await Services.auth.deleteManager(createdBy, id);
        return response.success(req, res, result, RESPONSE_CODES.OK, MESSAGES.MANAGER.DELETED);
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

export default {
    createManager,
    listManagers,
    setManagerStatus,
    resendManagerInvite,
    assignManagerAgency,
    deleteManager,
};
