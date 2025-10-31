# Setup Instructions for Arogya Platform

## Backend Setup Issues (Must Fix First)

### 1. Fix Authentication Middleware

**File:** `backend/routes/courseRoutes.ts`

Replace lines 11, 14, 15 with:

```typescript
router.post("/createCourse", authenticateUser, authorizeTutor, createCourseController);
router.put("/updateCourse/:id", authenticateUser, authorizeTutor, updateCourseController);
router.delete("/deleteCourse/:id", authenticateUser, authorizeTutor, deleteCourseController);
```

Don't forget to add the import at the top:
```typescript
import { authenticateUser } from "../middleware/authenticateUser";
```

### 2. Seed Categories in Database

The database needs categories before courses can be created. Run this in your database:

```sql
INSERT INTO "Category" (id, name, "createdAt", "updatedAt") VALUES
  ('cat_1', 'Arts & Crafts', NOW(), NOW()),
  ('cat_2', 'Cooking', NOW(), NOW()),
  ('cat_3', 'Dance', NOW(), NOW()),
  ('cat_4', 'Tours', NOW(), NOW()),
  ('cat_5', 'Music', NOW(), NOW()),
  ('cat_6', 'Language', NOW(), NOW()),
  ('cat_7', 'Culture & Heritage', NOW(), NOW()),
  ('cat_8', 'Adventure', NOW(), NOW());
```

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
bun install
```

### 2. Configure Cloudinary

Create `frontend/.env.local`:

```
# Get these from https://cloudinary.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
NEXT_PUBLIC_CLOUDINARY_API_SECRET=your_api_secret

# Create an unsigned upload preset in Cloudinary dashboard
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 3. Start Development Server

```bash
bun run dev
```

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
bun install
```

### 2. Configure Environment

Create `backend/.env`:

```
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secret_key_here
PORT=3000
```

### 3. Run Migrations

```bash
bun run prisma:migrate
```

### 4. Generate Prisma Client

```bash
bun run prisma:generate
```

### 5. Seed Categories (see above)

### 6. Start Server

```bash
bun run dev
```

## Testing the Flow

1. **Start both servers**: Backend (port 3000) and Frontend (port 3001/3002)
2. **Sign up** as a Tutor at `/auth/signup`
3. **Login** - you'll be redirected to `/dashboard/tutor`
4. **Create a course** with image upload to Cloudinary
5. **View courses** in tourist dashboard at `/dashboard/tourist`

## Troubleshooting

### "Failed to load courses"
- Make sure backend is running on port 3000
- Check backend logs for errors

### "Category is not set up"
- You need to seed the database with categories (see above)

### "Unauthorized" errors
- Check that authentication middleware is properly set up in backend routes
- Make sure JWT_SECRET is set in backend/.env

### Image upload fails
- Check Cloudinary credentials in frontend/.env.local
- Make sure upload preset is set to "unsigned"
- Check browser console for specific error messages

### Token not being stored
- Check browser localStorage (F12 > Application > Local Storage)
- Should see "token" and "user" keys after login
- If missing, check login form console logs

## Next Steps

Once backend is fixed:
- ✅ Full CRUD operations on courses
- ✅ Image uploads to Cloudinary
- ✅ JWT authentication
- ✅ Role-based dashboards
- ⏳ Booking system (backend ready, needs frontend UI)
- ⏳ Course details page
- ⏳ Profile management
