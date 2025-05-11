import httpStatus from "http-status-codes";
import statisticsService from "../services/statisticsService.js";

const getActiveAlumniStats = async (req, res) => {
  try {
    const stats = await statisticsService.fetchActiveAlumniStats(req.supabase);

    res.status(httpStatus.OK).json({
      status: "OK",
      stats: stats
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const getActiveJobsStats = async (req, res) => {
  try {
    const stats = await statisticsService.fetchActiveJobsStats(req.supabase);

    res.status(httpStatus.OK).json({
      status: "OK",
      stats: stats
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const getActiveEventsStats = async (req, res) => {
  try {
    const stats = await statisticsService.fetchActiveEventsStats(req.supabase);

    res.status(httpStatus.OK).json({
      status: "OK",
      stats: stats
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const getFundsRaisedStats = async (req, res) => {
  try {
    const stats = await statisticsService.fetchFundsRaisedStats(req.supabase);

    res.status(httpStatus.OK).json({
      status: "OK",
      stats: stats
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const getUpcomingEvents = async (req, res) => {
  try {
    const upcomingEvents = await statisticsService.fetchUpcomingEvents(req.supabase);

    res.status(httpStatus.OK).json({
      status: "OK",
      list: upcomingEvents
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const getProjectDonationSummary = async (req, res) => {
  try {
    const projectDonationSummary = await statisticsService.fetchProjectDonationSummary(req.supabase);

    res.status(httpStatus.OK).json({
      status: "OK",
      list: projectDonationSummary
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const getEventsSummary = async (req, res) => {
  try {
    const eventsSummary = await statisticsService.fetchEventsSummary(req.supabase);

    res.status(httpStatus.OK).json({
      status: "OK",
      list: eventsSummary
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};


const statisticsController = {
  getActiveAlumniStats,
  getActiveJobsStats,
  getActiveEventsStats,
  getFundsRaisedStats,
  getUpcomingEvents,
  getProjectDonationSummary,
  getEventsSummary
};

export default statisticsController;