// Use CommonJS `require` instead of `import`
import mongoose from 'mongoose';
import pkg from 'pg';
const { Client } = pkg;

import Application from './models/application.js'; // Add .js extension
import Page from './models/page.js';
import Location from './models/location.js'; // Add .js extension
import CameraLocation from './models/cameraLocation.js'; // Add .js extension
import Permission from './models/permission.js'; // Add .js extension
import Role from './models/role.js'; // Add .js extension
import Admin from './models/admin.js'; // Add .js extension
import User from './models/user.js'; // Add .js extension
import Camera from './models/cameras.js'; // Add .js extension
import Feed from './models/feed.js'; // Add .js extension
import Like from './models/like.js'; // Add .js extension
import Comment from './models/comment.js'; // Add .js extension
import Alert from './models/alert.js'; // Add .js extension
import Invitee from './models/invitees.js'; // Add .js extension
import Notification from './models/notification.js'; // Add .js extension
import Recording from './models/recording.js'; // Add .js extension
import UserApplication from './models/userApplication.js'; // Add .js extension


// PostgreSQL setup
const pgClient = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'instisafe',
  password: 'MyDb@2025',
  port: 5432
});

// MongoDB setup
mongoose.connect('mongodb+srv://developer:iitmresearch@instisafe.4pkmf.mongodb.net/?retryWrites=true&w=majority&appName=instisafe', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

pgClient.connect()
  .then(() => console.log("PostgreSQL connected"))
  .catch(err => console.error("PostgreSQL connection error:", err));


async function migrateData() {
  try {
    console.log('Starting Data Migration...');

    // Call each migration method separately
    await migrateApplications();
    await migratePages();
    await migrateLocations();
    await migrateCameraLocations();
    await migratePermissions();
    await migrateAdmins();
    await migrateRoles();
    await migrateUsers();
    await migrateCameras();
    await migrateFeeds();
    await migrateAlerts();
    await migrateInvitees();
    await migrateNotifications();
    await migrateRecordings();
    //await migrateAdminRoles();

    console.log("Data migration completed!");
  } catch (error) {
    console.error("Error during data migration:", error);
  } finally {
    pgClient.end();
    mongoose.disconnect();
  }
}

// Migration methods for each table
async function migrateApplications() {
  console.log("Applications migration started!");
  const applications = await Application.find();
  for (const app of applications) {
    const query = {
      text: 'INSERT INTO applications(application_name, application_url, application_logo_url, is_active, created_at, updated_at, map_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [app.applicationName, app.applicationUrl, app.applicationLogoURL, app.isActive, app.createdAt, app.updatedAt, app._id]
    };
    await pgClient.query(query);
    console.log(`Inserted Application: ${app.applicationName}`);
  }
  console.log("Applications migration completed!");
}

async function migratePages() {
  console.log("Pages migration started!");
  const pages = await Page.find();
  for (const page of pages) {
    const query = {
      text: 'INSERT INTO pages(name, url, page_icon, created_at, updated_at, map_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [page.name, page.url, page.pageIcon || null, page.createdAt, page.updatedAt, page._id]
    };
    await pgClient.query(query);
    console.log(`Inserted Page: ${page.name}`);
  }
  console.log("Pages migration completed!");
}

async function migrateLocations() {
  console.log("Locations migration started!");
  const locations = await Location.find();
  for (const location of locations) {
    const query = {
      text: 'INSERT INTO locations(location_type, coordinates, created_at, updated_at, map_id) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [location.location.type, location.location.coordinates, location.createdAt, location.updatedAt, location._id]
    };
    await pgClient.query(query);
    console.log(`Inserted Location with coordinates: ${location.location.coordinates}`);
  }
  console.log("Locations migration completed!");
}

async function migrateCameraLocations() {
  console.log("CameraLocations migration started!");
  const cameraLocations = await CameraLocation.find();
  for (const cameraLocation of cameraLocations) {
    const query = {
      text: 'INSERT INTO camera_locations(location_name, building_name, floor_number, status, created_at, updated_at, map_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [cameraLocation.locationName, cameraLocation.buildingName, cameraLocation.floorNumber || null, cameraLocation.status, cameraLocation.createdAt, cameraLocation.updatedAt, cameraLocation._id]
    };
    await pgClient.query(query);
    console.log(`Inserted CameraLocation: ${cameraLocation.locationName}`);
  }
  console.log("CameraLocations migration completed!");
}

async function migratePermissions() {
  console.log("Permissions migration started!");
  const permissions = await Permission.find();

  for (const permission of permissions) {
    const createPermission = permission.actions.create === 'true' || permission.actions.create === true;

    // Ensure valid Date objects before passing to PostgreSQL
    const createdAt = new Date(permission.createdAt);
    const updatedAt = new Date(permission.updatedAt);

    // Check if createdAt and updatedAt are valid Dates
    if (isNaN(createdAt.getTime()) || isNaN(updatedAt.getTime())) {
      console.error(`Invalid Date for permission: ${permission._id}`);
      continue;  // Skip this permission if the date is invalid
    }

    const mapId = permission._id.toString();
    const pageQuery = 'SELECT * FROM pages WHERE map_id = $1 LIMIT 1';
    const res = await pgClient.query(pageQuery, [permission.page_id]);

    if (res.rows.length > 0) {
      const query = {
        text: `
          INSERT INTO permissions(page_id, view, "create", edit, delete, created_at, updated_at, map_id) 
          VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        values: [
          res.rows[0].id,
          permission.actions.view,
          createPermission,
          permission.actions.edit,
          permission.actions.delete,
          createdAt,  // PostgreSQL expects JavaScript Date objects
          updatedAt,  // Same here
          mapId
        ]
      };

      await pgClient.query(query);
      console.log(`Inserted Permission for page: ${permission.page_id}`);
    }
  }

  console.log("Permissions migration completed!");
}


async function migrateAdmins() {
  console.log("Admins migration started!");
  const admins = await Admin.find();
  for (const admin of admins) {
    const query = {
      text: 'INSERT INTO admins(username, email, password_hash, is_first_login, status, phone_number, emergency_number, profile_photo, date_of_birth, address, gender, blood_group, report_to, created_at, updated_at, map_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id',
      values: [
        admin.username, admin.email, admin.password_hash, admin.is_first_login, admin.status, admin.phoneNumber, admin.emergencyNumber, admin.profilePhoto, admin.dateOfBirth,
        admin.address, admin.gender, admin.bloodGroup, admin.reportTo, admin.createdAt, admin.updatedAt, admin._id
      ]
    };
    const result = await pgClient.query(query);
    console.log(`Inserted Admin with ID: ${result.rows[0].id}`);
  }
  console.log("Admins migration completed!");
}

async function migrateRoles() {
  console.log("Roles migration started!");
  const roles = await Role.find();
  for (const role of roles) {
    const status = ['active', 'inactive'].includes(role.status) ? role.status : 'active';
    const createdByMapId = role.createdBy.toString();
    const createdAdminQuery = {
      text: 'SELECT id FROM admins WHERE map_id = $1',
      values: [createdByMapId]
    };
    const createdAdminResult = await pgClient.query(createdAdminQuery);
    const createdBy = createdAdminResult.rows[0]?.id || 1;  // Use default if no match

    const updatedByMapId = role.updatedBy.toString();
    const updatedAdminQuery = {
      text: 'SELECT id FROM admins WHERE map_id = $1',
      values: [updatedByMapId]
    };
    const updatedAdminResult = await pgClient.query(updatedAdminQuery);
    const updatedBy = updatedAdminResult.rows[0]?.id || 1;  // Use default if no match

    const query = {
      text: 'INSERT INTO roles(name, created_by, updated_by, status, created_at, updated_at, map_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [role.name, createdBy, updatedBy, status, role.createdAt, role.updatedAt, role._id.toString()]
    };
    const result = await pgClient.query(query);
    console.log(`Inserted Role with ID: ${result.rows[0].id}`);


    // Migrate Role Permissions (many-to-many relationship)
    const roleId = result.rows[0].id;

    if (role.permissions && Array.isArray(role.permissions)) {

      for (const permissionId of role.permissions) {
        console.log('permissionId ', permissionId._id.toString());
        const permissionQuery = 'SELECT * FROM permissions WHERE map_id = $1 LIMIT 1';
        const res = await pgClient.query(permissionQuery, [permissionId._id.toString()]);

        if (res.rows.length > 0) {
          const rolePermissionQuery = {
            text: 'INSERT INTO role_permissions(role_id, permission_id) VALUES($1, $2)',
            values: [roleId, res.rows[0].id],
          };
          await pgClient.query(rolePermissionQuery);
          console.log(`Linked Role ${role.name} with Permission ID: ${permissionId._id.toString()}`);
        }
      }
    } else {
      console.error("role.permissions is either null/undefined or not an array");
    }
  }
  console.log("Roles migration completed!");

}

async function migrateAdminRoles() {
  const adminRoles = await Admin.find();
  for (const admin of adminRoles) {
    // Link Admin with Roles (many-to-many relationship)
    console.log('admin.role ', admin.role.toString());
    if (admin.role) {

      const createdByMapId = admin._id.toString();
      const createdAdminQuery = {
        text: 'SELECT id FROM admins WHERE map_id = $1',
        values: [createdByMapId]
      };
      const createdAdminResult = await pgClient.query(createdAdminQuery);
      console.log('createdAdminResult.rows ', createdAdminResult.rows);
      const adminId = createdAdminResult.rows[0].id;  // Use default if no match

      const query = 'SELECT * FROM roles WHERE map_id = $1 LIMIT 1';
      const res = await pgClient.query(query, [admin.role.toString()]);

      if (res.rows.length > 0) {
        const adminRoleQuery = {
          text: 'INSERT INTO admin_roles(user_id, role_id, assigned_at) VALUES($1, $2, $3)',
          values: [adminId, res.rows[0].id, admin.createdAt],
        };
        await pgClient.query(adminRoleQuery);
        console.log(`Linked Admin with Role ID: ${admin.role}`);
      }
    }
  }
}


async function migrateUsers() {
  console.log("Users migration started!");
  // Migrate Users
  const users = await User.find();
  for (const user of users) {
    const query = {
      text: 'INSERT INTO users(name, email, fcm_token, invited_by, created_at, updated_at, map_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [user.name, user.email, user.fcmToken, user.invitedBy, user.createdAt, user.updatedAt, user._id]
    };
    const result = await pgClient.query(query);
    const userId = result.rows[0].id;
    console.log(`Inserted User with ID: ${userId}`);
  }

  // Migrate UserApplications
  const userApplications = await UserApplication.find();
  for (const userApplication of userApplications) {

    const user_query = 'SELECT * FROM admins WHERE map_id = $1 LIMIT 1';
    const user_res = await pgClient.query(user_query, [userApplication.userId]);

    const app_query = 'SELECT * FROM applications WHERE map_id = $1 LIMIT 1';
    const app_res = await pgClient.query(app_query, [userApplication.applicationId]);

    const query = {
      text: 'INSERT INTO user_applications(user_id, application_id, created_at, updated_at) VALUES($1, $2, $3, $4)',
      values: [user_res.rows[0].id, app_res.rows[0].id, userApplication.createdAt, userApplication.updatedAt]
    };
    await pgClient.query(query);
    console.log(`Linked User Application: User ${userApplication.userId} - Application ${userApplication.applicationId}`);
  }
  console.log("Users migration completed!");
}

async function migrateCameras() {
  console.log("Cameras migration started!");
  // Migrate Cameras
  const cameras = await Camera.find();
  for (const camera of cameras) {
    const query = {
      text: 'INSERT INTO cameras(location_type, coordinates, name, building, location_id, rtsp, created_at, updated_at, map_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [camera.location.type, camera.location.coordinates, camera.name, camera.building, camera.locationId, camera.rtsp, camera.createdAt, camera.updatedAt, camera._id]
    };
    const result = await pgClient.query(query);
    const cameraId = result.rows[0].id;
    console.log(`Inserted Camera with ID: ${cameraId}`);
  }
  console.log("Cameras migration completed!");
}
async function migrateFeeds() {
  console.log("Feeds migration started!");
  // Migrate Feeds
  const feeds = await Feed.find();
  for (const feed of feeds) {
    const createdByMapId = feed.createdBy.toString();
    const createdAdminQuery = {
      text: 'SELECT id FROM admins WHERE map_id = $1',
      values: [createdByMapId]
    };
    const createdAdminResult = await pgClient.query(createdAdminQuery);
    const createdBy = createdAdminResult.rows[0]?.id || 1;  // Use default if no match

    const updatedBy = 1;
    if(feed.modifiedBy) {
      const updatedByMapId = feed.modifiedBy.toString();
      const updatedAdminQuery = {
        text: 'SELECT id FROM admins WHERE map_id = $1',
        values: [updatedByMapId]
      };
      const updatedAdminResult = await pgClient.query(updatedAdminQuery);
      updatedBy = updatedAdminResult.rows[0]?.id || 1;  // Use default if no match
    }

    const query = {
      text: 'INSERT INTO feeds(title, description, image_urls, created_by, modified_by, created_at, deleted, map_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [
        feed.title,
        feed.description,
        feed.imageUrls,
        createdBy,
        updatedBy,
        feed.createdAt,
        feed.deleted,
        feed._id,
      ],
    };
    const result = await pgClient.query(query);
    const feedId = result.rows[0].id;
    console.log(`Inserted Feed with ID: ${feedId}`);

    // Migrate Likes
    for (const like of feed.likes) {
      const user_query = 'SELECT * FROM permissions WHERE map_id = $1 LIMIT 1';
      const user_res = await pgClient.query(user_query, [like]);

      const likeQuery = {
        text: 'INSERT INTO likes(feed_id, user_id, created_at) VALUES($1, $2, $3)',
        values: [feedId, user_res.rows[0].id, feed.createdAt],
      };
      await pgClient.query(likeQuery);
      console.log(`Linked Like to Feed ID: ${feedId}`);
    }

    // Migrate Comments
    for (const comment of feed.comments) {

      const user_query = 'SELECT * FROM permissions WHERE map_id = $1 LIMIT 1';
      const user_res = await pgClient.query(user_query, [comment.userId]);

      const commentQuery = {
        text: 'INSERT INTO comments(feed_id, user_id, content, created_at, updated_at) VALUES($1, $2, $3, $4, $5)',
        values: [feedId, user_res.rows[0].id, comment.content, comment.createdAt, comment.updatedAt],
      };
      await pgClient.query(commentQuery);
      console.log(`Linked Comment to Feed ID: ${feedId}`);
    }
  }
  console.log("Feeds migration completed!");
}

async function migrateAlerts() {
  console.log("Alerts migration started!");
  // Migrate Alerts
  const alerts = await Alert.find();
  for (const alert of alerts) {
    const userMapId = alert.user;
    const userQuery = {
      text: 'SELECT id FROM users WHERE map_id = $1',
      values: [userMapId]
    };
    const userResult = await pgClient.query(userQuery);
    const user = userResult.rows[0]?.id || 1;  // Use default if no match

    const createdByMapId = alert.assignee;
    const createdAdminQuery = {
      text: 'SELECT id FROM admins WHERE map_id = $1',
      values: [createdByMapId]
    };
    const createdAdminResult = await pgClient.query(createdAdminQuery);
    const assignee = createdAdminResult.rows[0]?.id || 1;  // Use default if no match

    const query = {
      text: 'INSERT INTO alerts(user_id, location_type, coordinates, status, frontend_timestamp, acked_at, resolved_at, resolved_by, acked_by, assignee, origin, created_at, updated_at, map_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id',
      values: [
        user,
        alert.location.type,
        alert.location.coordinates,
        alert.status,
        alert.frontendTimestamp,
        alert.ackedAt,
        alert.resolvedAt,
        alert.resolvedBy,
        alert.ackedBy,
        assignee,
        alert.origin,
        alert.createdAt,
        alert.updatedAt,
        alert._id,
      ],
    };
    const result = await pgClient.query(query);
    const alertId = result.rows[0].id;
    console.log(`Inserted Alert with ID: ${alertId}`);
  }
  console.log("Alerts migration completed!");
}

async function migrateInvitees() {
  console.log("Invitees migration started!");
  // Migrate Invitees
  const invitees = await Invitee.find();
  for (const invitee of invitees) {
    const userMapId = invitee.invitedBy;
    const userQuery = {
      text: 'SELECT id FROM users WHERE map_id = $1',
      values: [userMapId]
    };
    const userResult = await pgClient.query(userQuery);
    const user = userResult.rows[0]?.id || 1;  // Use default if no match

    const query = {
      text: 'INSERT INTO invitees(invited_by, email, is_registered, created_at, updated_at, map_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [
        user,
        invitee.email,
        invitee.isRegistered,
        invitee.createdAt,
        invitee.updatedAt,
        invitee._id,
      ],
    };
    const result = await pgClient.query(query);
    const inviteeId = result.rows[0].id;
    console.log(`Inserted Invitee with ID: ${inviteeId}`);
  }
  console.log("Invitees migration completed!");
}

async function migrateNotifications() {
  console.log("Notifications migration started!");
  // Copy notifications to PostgreSQL
  const notifications = await Notification.find({});
  for (let notification of notifications) {
    const { title, message, createdAt, createdBy, isNotified } = notification;

    const createdByMapId = createdBy.toString();
    const createdAdminQuery = {
      text: 'SELECT id FROM admins WHERE map_id = $1',
      values: [createdByMapId]
    };
    const createdAdminResult = await pgClient.query(createdAdminQuery);
    const createdByAdmin = createdAdminResult.rows[0]?.id || 1;  // Use default if no match

    const query = `
        INSERT INTO notifications (title, message, created_at, created_by, is_notified, map_id)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
    const result = await pgClient.query(query, [
      title,
      message,
      createdAt,
      createdByAdmin, // Assuming createdBy is an admin's ID
      isNotified,
      notification._id,
    ]);

    //const notificationId = result.rows[0].id;
    //console.log(`Inserted notifications with ID: ${notificationId}`);
  }
  console.log("Notifications migration completed!");
}

async function migrateRecordings() {
  console.log("Recordings migration started!");

  const recordings = await Recording.find({});

  for (let recording of recordings) {
    const { startedAt, stoppedAt, cameraId, alertId, createdAt, updatedAt } = recording;

    // Validate and sanitize dates
    const validCreatedAt = new Date(createdAt);
    const validUpdatedAt = new Date(updatedAt);

    // Skip if dates are invalid
    if (isNaN(validCreatedAt.getTime()) || isNaN(validUpdatedAt.getTime())) {
      console.error(`Invalid date for recording: ${recording._id}`);
      continue;  // Skip invalid records
    }

    // Prepare data for insertion
    const mapId = recording._id.toString();

    try {
      const query = `
        INSERT INTO recordings (started_at, stopped_at, camera_id, alert_id, created_at, updated_at, map_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id;
      `;

      const values = [
        startedAt,
        stoppedAt,
        cameraId,  // MongoDB ObjectId, assuming matches PostgreSQL camera table ID
        alertId,   // MongoDB ObjectId, assuming matches PostgreSQL alerts table ID
        validCreatedAt,
        validUpdatedAt,
        mapId
      ];

      // Execute the insert query
      const result = await pgClient.query(query, values);

      // Log the inserted recording ID
      console.log(`Inserted recording with ID: ${result.rows[0].id}`);
    } catch (error) {
      console.error(`Error inserting recording ${recording._id}:`, error);
    }
  }

  console.log("Recordings migration completed!");
}


// Call the function to copy the data
migrateData();


