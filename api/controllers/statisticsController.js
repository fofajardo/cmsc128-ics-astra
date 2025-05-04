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
}

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
    })
  }
}

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
    })
  }
}

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
    })
  }
}

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
    })
  }
}

const statisticsController = {
  getActiveAlumniStats,
  getActiveJobsStats,
  getActiveEventsStats,
  getFundsRaisedStats,
  getUpcomingEvents
};

export default statisticsController;