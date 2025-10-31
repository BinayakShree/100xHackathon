# Backend Issues Report

## Critical Issue in Course Routes

**File:** `backend/routes/courseRoutes.ts`

**Problem:** Missing `authenticateUser` middleware before `authorizeTutor` middleware on protected routes.

**Affected Routes:**
- `POST /api/course/createCourse` (line 11)
- `PUT /api/course/updateCourse/:id` (line 14)
- `DELETE /api/course/deleteCourse/:id` (line 15)

**Current Code:**
```typescript
router.post("/createCourse", authorizeTutor, createCourseController);
router.put("updateCourse/:id", authorizeTutor, updateCourseController);
router.delete("deleteCourse/:id", authorizeTutor, deleteCourseController);
```

**Issue:** The `authorizeTutor` middleware expects `req.user` to be set (from JWT), but without `authenticateUser` first, `req.user` is undefined, causing authorization failures.

**Expected Pattern (as used in bookingRoute.ts):**
```typescript
router.post("/createCourse", authenticateUser, authorizeTutor, createCourseController);
```

## Data Model Mismatch with Frontend

**Frontend Expectations vs Backend Schema:**

1. **Duration Field:**
   - Frontend expects: `duration` as a number (hours)
   - Backend schema: `duration` as a String (e.g., "3 hours", "2 days")

2. **Images:**
   - Frontend expects: `imageUrl` (single string)
   - Backend schema: `photos` (array of CoursePhoto objects with URL)

3. **Max Students:**
   - Frontend has: `maxStudents` field
   - Backend schema: **MISSING** this field

4. **Category:**
   - Frontend expects: `category` (string name)
   - Backend schema: `categoryId` (string ID, requires Category model lookup)

## Missing Category Management

**Issue:** Backend requires `categoryId` but there are no routes to:
- Create categories
- List available categories
- Frontend has no way to know valid `categoryId` values

## Course CRUD Inconsistencies

**Issue in `backend/routes/courseRoutes.ts`:**
- Line 11: `POST /createCourse` - uses `authorizeTutor` (missing auth)
- Line 13: `GET /course/:id` - no authentication required (OK)
- Line 14: `PUT /updateCourse/:id` - path missing leading `/` (should be `/updateCourse/:id`)
- Line 15: `DELETE /deleteCourse/:id` - path missing leading `/` (should be `/deleteCourse/:id`)

## Missing Category Seeding

**Issue:** No categories exist in the database. The migration only creates the Category table but doesn't seed any data.

**Impact:** Course creation will fail because all courses require a valid `categoryId` that doesn't exist.

**Solution Options:**
1. Create a migration/seed script to add default categories (Arts & Crafts, Cooking, Dance, Tours, Music, etc.)
2. Add an API endpoint to list all categories
3. Provide predefined category IDs in the documentation

## Frontend Integration Notes

**Cloudinary Setup Required:**
1. Create a Cloudinary account at https://cloudinary.com
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Create an upload preset (unsigned) in Settings > Upload
4. Add these environment variables to `frontend/.env.local`:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
   NEXT_PUBLIC_CLOUDINARY_API_SECRET=your_api_secret
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```
5. The frontend will upload images to Cloudinary before sending URLs to the backend

**Current Frontend Implementation:**
- ✅ JWT authentication integrated
- ✅ Cloudinary image upload integrated
- ✅ API integration with backend routes
- ✅ Category management using fallback IDs
- ✅ Proper error handling with user feedback
- ⚠️ Requires backend fixes before full functionality

## Summary

**Critical:** Add `authenticateUser` middleware to all protected course routes before `authorizeTutor`.

**Critical:** Seed the database with at least one category before testing course creation.

**Important:** Consider adding a category management API or providing a predefined list of categories.

**Nice to Have:** Align frontend data expectations with backend schema, or create adapters.

