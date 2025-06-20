import httpStatus from "http-status-codes";
import reportsService from "../services/reportsService.js";
import { Actions, Subjects } from "../../common/scopes.js";

const getReports = async (req, res) => {
  if (req.you.cannot(Actions.READ, Subjects.REPORT)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FORBIDDEN",
      message: "You are not allowed to access this resource."
    });
  }

  try {
    const { page = 1, limit = 10 } = req.query;
    const { data, error } = await reportsService.fetchReports(req.supabase, page, limit);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      list: data || []
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const getReportById = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { data, error } = await reportsService.fetchReportById(req.supabase, reportId);

    if (error) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Report not found"
      });
    }

    if (req.you.cannotAs(Actions.READ, Subjects.REPORT, data)) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "You are not allowed to access this resource."
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      report: data
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const createReport = async (req, res) => {
  if (req.you.cannot(Actions.CREATE, Subjects.REPORT)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FORBIDDEN",
      message: "You are not allowed to access this resource."
    });
  }

  try {
    const requiredFields = ["reporter_id", "type", "details"];
    const missingFields = requiredFields.filter(field => req.body[field] == null);

    if (missingFields.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: `Missing required fields: ${missingFields.join(", ")}`
      });
    }

    const reportData = {
      reporter_id: req.body.reporter_id,
      content_id: req.body.content_id || null,
      type: req.body.type,
      details: req.body.details,
      status: 0
    };

    const { data, error } = await reportsService.insertReport(req.supabase, reportData);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message
      });
    }

    return res.status(httpStatus.CREATED).json({
      status: "CREATED",
      message: "Report successfully created",
      id: data[0].id
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const updateReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    if (typeof status !== "number") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid or missing status"
      });
    }

    const { error } = await reportsService.updateReportStatus(req.supabase, reportId, status);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message
      });
    }

    if (req.you.cannotAs(Actions.MANAGE, Subjects.REPORT)) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "You are not allowed to access this resource."
      });
    }

    return res.status(httpStatus.OK).json({
      status: "UPDATED",
      message: "Report status updated"
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const { error } = await reportsService.deleteReport(req.supabase, reportId);

    if (req.you.cannotAs(Actions.MANAGE, Subjects.REPORT)) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "You are not allowed to access this resource."
      });
    }

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message
      });
    }

    return res.status(httpStatus.OK).json({
      status: "DELETED",
      message: "Report successfully deleted"
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const reportsController = {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport
};

export default reportsController;
