# Patient Profile Module

This module provides components for managing patient profiles in the Nirapod Tika application.

## Authentication Issue Solution

### Problem

The backend API requires different authentication formats for different endpoints:
- Main application endpoints use JWT format: `Authorization: JWT <token>`
- Patient profile endpoints require Token format: `Authorization: Token <token>`

This inconsistency was causing 401 and 500 errors when trying to update patient profiles.

### Solution

1. **Smart Authentication Service**:
   - We implemented a smarter authentication mechanism that automatically determines the correct format for each endpoint.
   - The solution caches successful authentication formats to improve performance.
   - It can seamlessly switch between JWT, Token, and Bearer formats as needed.

2. **Diagnostic Tools**:
   - `TokenDebugger`: Analyzes token validity, expiration, and tests which authentication formats work.
   - `ApiTester`: Tests individual API endpoints with different request methods and auth formats.
   - `ApiConnectionTester`: Comprehensive testing tool that checks all endpoints with different auth formats simultaneously and provides clear recommendations.

## How it Works

The auth-aware API client functions follow this approach:
1. Check if we have a cached successful format for the endpoint
2. If yes, try with that format first
3. If no or if the cached format fails, try both JWT and Token formats
4. Cache the successful format for future use
5. Provide detailed error information if both fail

## Components

1. **PatientProfileEdit**: Main component for editing patient profiles
2. **PatientProfileForm**: Reusable form component for patient data entry
3. **api.js**: API service functions for patient profile CRUD operations
4. **TokenDebugger**: Tool for analyzing token validity and auth format compatibility
5. **ApiTester**: Tool for testing individual API endpoints
6. **ApiConnectionTester**: Comprehensive API testing tool with recommendations

## Features

- Create new patient profile
- Update existing patient profile
- Upload profile picture
- Form validation
- Server error handling
- Only send changed fields to reduce data transfer

## Authentication

**Important**: This module uses Token authentication, while the main app uses JWT authentication:

- Patient profile API calls use: `Authorization: Token <token>`
- Main app API calls use: `Authorization: JWT <token>`

This was required by the backend team for the patient profile endpoints. The token value itself is the same, only the prefix differs.

## Usage

### Adding to Your Routes

```jsx
import { PatientProfileEdit } from '../components/patient-profile';

// In your routes configuration
<Route path="/profile/patient/edit" element={
    <ProtectedRoute>
        <PatientProfileEdit />
    </ProtectedRoute>
} />
```

### Linking to the Profile Edit Page

```jsx
import { Link } from 'react-router-dom';

<Link to="/profile/patient/edit" className="button">Edit Profile</Link>
```

## API Requirements

The backend API expects:
- Token authentication (not JWT) for patient profile endpoints
- Only changed fields for updates (partial updates supported)
- FormData for file uploads
- Required fields: email, nid
- `user` field must be included with the user ID

## Troubleshooting

1. If you get a 500 server error, check:
   - Is the auth token format correct? (Token vs JWT)
   - Are you sending all required fields?
   - Is file size within limits?

2. If profile isn't updating:
   - Check console logs for API responses
   - Verify network requests in browser developer tools

### Fixing 500 Errors with FormData and File Uploads

If you're getting 500 server errors when uploading files using FormData, try these solutions:

1. **Content-Type Header Issues**:
   - When using FormData with file uploads, DO NOT set the Content-Type header manually
   - Let the browser automatically set the correct `multipart/form-data` header with the proper boundary
   - We've updated our API service to handle this correctly

2. **Authentication Format**:
   - Make sure you're using the correct auth format (`Token` instead of `JWT`) for patient profile endpoints
   - Use the `ApiConnectionTester` to determine the correct format for your endpoint

3. **Invalid FormData Structure**:
   - Make sure your form fields match exactly what the backend expects
   - Verify that the user ID is included correctly in the FormData
   - Check for any required fields that might be missing

4. **File Size Limitations**:
   - The server may have restrictions on file size
   - Try with a smaller image file (under 1MB)
   - Compress your image before uploading

### Using the Debug Tools

To diagnose API issues:

1. Use the `ApiConnectionTester` to determine which authentication format works for each endpoint
2. Check if your token is valid and not expired using the `TokenDebugger`
3. Ensure that your form data is correctly formatted for the API endpoints
4. Check the browser console for detailed error messages from the enhanced logging 