import { errorMessage } from "../../../config/config.js";
import "dotenv/config.js";
import User from "../../../models/UserModel.js";
import Trip from "../../../models/TripModel.js";
import Vehicle from "../../../models/VehicleModel.js";
import Charger from "../../../models/ChargerModel.js";
import Stats from "../../../models/StatsModel.js";

const excludeEmails = [
  "irfan.ali@solutionsloft.com",
  "mudasir.yasin@solutionsloft.com",
  "saibadeen47@gmail.com",
  "saibadeen48@gmail.com",
  "talharauf.bsee@gmail.com",
  "solutionsloft@icloud.com",
  "solutionsloftllc@gmail.com",
  "mudasirtestqa@gmail.com",
  "mudasiryasin@gmail.com",
  "mudasirsqa@gmail.com"
];

function getRelativeStats(docs) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousData = docs.filter(
    (
      doc // Data for the previous month
    ) =>
      doc.createdAt.getFullYear() === previousYear && // match year
      doc.createdAt.getMonth() === previousMonth // match the previous month
  );
  const currentData = docs.filter(
    (
      doc // Data for the current month
    ) =>
      doc.createdAt.getFullYear() === currentYear && // match year
      doc.createdAt.getMonth() === currentMonth // match the current month
  );

  let value = 0;
  const status =
    previousData.length < currentData.length ? "increase" : "decrease";

  if (previousData.length > 0 && currentData.length > 0) {
    if (status === "increase") {
      value =
        ((currentData.length - previousData.length) / previousData.length) *
        100;
    } else {
      value =
        ((previousData.length - currentData.length) / previousData.length) *
        100;
    }
  } else if (previousData.length > 0 && currentData.length === 0) {
    value = 100;
  }

  if (value === 0) {
    return `0% ${status} from last month`;
  } else {
    return `${Math.abs(Math.round(value)) > 100 ? 100 : Math.abs(Math.round(value))
      }% ${status} from last month`;
  }
}

async function getRecentTrips() {
  try {
    const recentTrips = await Trip.find({})
      .populate({
        path: "vehicleId",
        select: "-__v",
        populate: [{ path: "make", select: "-__v" }],
      })
      .sort({ createdAt: -1 })
      .limit(10);
    return recentTrips;
  } catch (error) {
    throw new Error("Error fetching recent trips");
  }
}

const calculateDataByDay = (users, trips, vehicles) => {
  const currentDate = new Date();
  const daysData = [];

  // Loop through the last 6 days
  for (let i = 0; i < 6; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - i);

    // Filter data for the current day
    const usersForDay = users.filter((item) => {
      const itemDate = new Date(item.createdAt);
      return (
        itemDate.getFullYear() === date.getFullYear() &&
        itemDate.getMonth() === date.getMonth() &&
        itemDate.getDate() === date.getDate()
      );
    });

    const tripsForDay = trips.filter((item) => {
      const itemDate = new Date(item.createdAt);
      return (
        itemDate.getFullYear() === date.getFullYear() &&
        itemDate.getMonth() === date.getMonth() &&
        itemDate.getDate() === date.getDate()
      );
    });

    const vehiclesForDay = vehicles.filter((item) => {
      const itemDate = new Date(item.createdAt);
      return (
        itemDate.getFullYear() === date.getFullYear() &&
        itemDate.getMonth() === date.getMonth() &&
        itemDate.getDate() === date.getDate()
      );
    });

    // Calculate the number of users, trips, and vehicles for the day
    const usersCount = usersForDay.reduce((sum, item) => sum + 1, 0);
    const tripsCount = tripsForDay.reduce((sum, item) => sum + 1, 0);
    const vehiclesCount = vehiclesForDay.reduce((sum, item) => sum + 1, 0);

    // Add data to the array
    daysData.push({
      name: date.toLocaleDateString("en-US", { weekday: "short" }), // Get the day name (e.g., "Mon")
      users: usersCount,
      trips: tripsCount,
      vehicles: vehiclesCount,
    });
  }

  return daysData;
};

const calculateDataByWeek = (users, trips, vehicles) => {
  const currentDate = new Date();
  const weeksData = [];

  // Loop through the last 6 weeks
  for (let i = 0; i < 4; i++) {
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - i * 7);

    // Filter data for the current week
    const UsersForWeek = users.filter((item) => {
      const itemDate = new Date(item.createdAt);
      return (
        itemDate >= startDate &&
        itemDate < new Date(startDate).setDate(startDate.getDate() + 7)
      );
    });

    const TripsForWeek = trips.filter((item) => {
      const itemDate = new Date(item.createdAt);
      return (
        itemDate >= startDate &&
        itemDate < new Date(startDate).setDate(startDate.getDate() + 7)
      );
    });

    const VehiclesForWeek = vehicles.filter((item) => {
      const itemDate = new Date(item.createdAt);
      return (
        itemDate >= startDate &&
        itemDate < new Date(startDate).setDate(startDate.getDate() + 7)
      );
    });

    // Calculate the number of users, trips, and vehicles for the week
    const usersCount = UsersForWeek.reduce((sum, item) => sum + 1, 0);
    const tripsCount = TripsForWeek.reduce((sum, item) => sum + 1, 0);
    const vehiclesCount = VehiclesForWeek.reduce((sum, item) => sum + 1, 0);

    // Add data to the array
    weeksData.push({
      name: `Week ${i + 1}`, // You can customize the week name as needed
      users: usersCount,
      trips: tripsCount,
      vehicles: vehiclesCount,
    });
  }

  return weeksData;
};

const calculateDataByMonth = (users, trips, vehicles) => {
  const currentDate = new Date();
  const monthsData = [];

  // Loop through the last 6 months
  for (let i = 0; i < 6; i++) {
    const startDate = new Date(currentDate);
    startDate.setMonth(currentDate.getMonth() - i);

    // Filter data for the current month
    const UsersForMonth = users.filter((item) => {
      const itemDate = new Date(item.createdAt);
      return (
        itemDate.getMonth() === startDate.getMonth() &&
        itemDate.getFullYear() === startDate.getFullYear()
      );
    });

    const TripsForMonth = trips.filter((item) => {
      const itemDate = new Date(item.createdAt);
      return (
        itemDate.getMonth() === startDate.getMonth() &&
        itemDate.getFullYear() === startDate.getFullYear()
      );
    });

    const VehiclesForMonth = vehicles.filter((item) => {
      const itemDate = new Date(item.createdAt);
      return (
        itemDate.getMonth() === startDate.getMonth() &&
        itemDate.getFullYear() === startDate.getFullYear()
      );
    });

    // Calculate the number of users, trips, and vehicles for the month
    const usersCount = UsersForMonth.reduce((sum, item) => sum + 1, 0);
    const tripsCount = TripsForMonth.reduce((sum, item) => sum + 1, 0);
    const vehiclesCount = VehiclesForMonth.reduce((sum, item) => sum + 1, 0);

    // Add data to the array
    monthsData.push({
      name: startDate.toLocaleString("default", { month: "short" }), // Month abbreviation (e.g., "Jan")
      users: usersCount,
      trips: tripsCount,
      vehicles: vehiclesCount,
    });
  }

  return monthsData;
};

export const getDashboardData = async (req, res) => {
  try {
    // Validate user authorization
    const userId = req?.userInfo?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized access",
      });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Fetch all required data in parallel for better performance
    const [
      users,
      trips,
      downloadStats,
      vehicles,
      successTrips,
      chargingActivities,
      recentTrips,
      lastMonthActiveUsers
    ] = await Promise.all([
      User.find({ email: { $nin: excludeEmails } }, "createdAt lastActiveAt"),
      Trip.find({}, "createdAt userId").populate({
        path: "userId",
        select: "email",
        match: { email: { $nin: excludeEmails } },
      }),
      Stats.find({}),
      Vehicle.find({}, "createdAt userId").populate({
        path: "userId",
        select: "email",
        match: { email: { $nin: excludeEmails } },
      }),
      Trip.find(
        {
          status: "completed",
        },
        "createdAt userId"
      ).populate({
        path: "userId",
        select: "email",
        match: { email: { $nin: excludeEmails } },
      }),
      Charger.find({}, "createdAt"),
      getRecentTrips(),
      User.countDocuments({
        email: { $nin: excludeEmails },
        lastActiveAt: { $gte: thirtyDaysAgo }
      })
    ]);

    // Filter out trips and vehicles where the populated user is null (excluded users)
    const filteredTrips = trips.filter((trip) => trip.userId !== null);
    const filteredVehicles = vehicles.filter(
      (vehicle) => vehicle.userId !== null
    );
    const filteredSuccessTrips = successTrips.filter(
      (trip) => trip.userId !== null
    );

    // Prepare stats data
    const stats = [
      {
        label: "Weekly Android Downloads",
        value: downloadStats[0]?.androidWeekly || 0,
        desc: "same",
      },
      {
        label: "Lifetime Android Downloads",
        value: downloadStats[0]?.androidLifetime || 0,
        desc: "same",
      },
      {
        label: "Weekly iOS Downloads",
        value: downloadStats[0]?.iosWeekly || 0,
        desc: "same",
      },
      {
        label: "Lifetime iOS Downloads",
        value: downloadStats[0]?.iosLifetime || 0,
        desc: "same",
      },
      {
        label: "Total Users",
        value: users.length,
        desc: getRelativeStats(users),
      },
      {
        label: "Last Month Active Users",
        value: lastMonthActiveUsers,
        desc: "Users active in the last 30 days",
      },
      {
        label: "Total Trips",
        value: filteredTrips.length,
        desc: getRelativeStats(filteredTrips),
      },
      {
        label: "Total Vehicles",
        value: filteredVehicles.length,
        desc: getRelativeStats(filteredVehicles),
      },
      {
        label: "Successful Trips",
        value: filteredSuccessTrips.length,
        desc: getRelativeStats(filteredSuccessTrips),
      },
      {
        label: "Charging Activity",
        value: chargingActivities.length,
        desc: getRelativeStats(chargingActivities),
      },
    ];

    return res.status(200).json({
      stats,
      recent: recentTrips,
    });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const getLastActiveUsers = async (req, res) => {
  try {
    // Validate user authorization
    const userId = req?.userInfo?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized access",
      });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch users with pagination
    const [users, totalUsers] = await Promise.all([
      User.find({
        email: { $nin: excludeEmails },
        lastActiveAt: { $gte: thirtyDaysAgo }
      })
        .select('email name lastActiveAt createdAt')
        .sort({ lastActiveAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments({
        email: { $nin: excludeEmails },
        lastActiveAt: { $gte: thirtyDaysAgo }
      })
    ]);

    return res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          limit
        }
      }
    });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const getPerformanceData = async (req, res) => {
  const userId = req?.userInfo?.userId;
  if (!userId)
    return res
      .status(401)
      .send({ error: "You are not authorized for this request." });
  try {
    const users = await User.find({}, "createdAt");
    const trips = await Trip.find({}, "createdAt");
    const vehicles = await Vehicle.find({}, "createdAt");

    const last6DaysData = calculateDataByDay(users, trips, vehicles);
    const last6WeeksData = calculateDataByWeek(users, trips, vehicles);
    const last6MonthsData = calculateDataByMonth(users, trips, vehicles);

    res.status(200).json({
      daily: last6DaysData.reverse(),
      weekly: last6WeeksData.reverse(),
      monthly: last6MonthsData.reverse(),
    });
  } catch (error) {
    errorMessage(res, error);
  }
};
