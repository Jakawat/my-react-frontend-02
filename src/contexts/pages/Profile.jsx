import { useUser } from "../UserProvider";
import { useEffect, useState, useCallback, useRef } from "react";

export default function Profile() {
  const { logout } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchProfile = useCallback(async () => {
    console.log("Fetching profile from:", `${API_URL}/api/user/profile`);
    
    try {
      const result = await fetch(`${API_URL}/api/user/profile`, {
        method: "GET",
        credentials: "include"
      });

      console.log("Response status:", result.status);

      if (result.status === 401) {
        console.log("Unauthorized - logging out");
        logout();
        return;
      }

      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }

      const profileData = await result.json();
      console.log("Profile data received:", profileData);
      setData(profileData);
      setError(null);
    } catch (error) {
      console.error("Fetch profile error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, logout]);

  const handleImageUpload = async () => {
    const file = fileInputRef.current?.files[0];
    if (!file) {
      alert("Please select a file.");
      return;
    }

    // Validate file type on frontend
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only image files are allowed (JPEG, PNG, GIF, WebP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/api/user/profile/image`, {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      const result = await response.json();

      if (response.ok) {
        alert("Image updated successfully!");
        // Clear file input
        fileInputRef.current.value = "";
        // Refresh profile data
        await fetchProfile();
      } else {
        setUploadError(result.message || "Failed to update image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Error uploading image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!window.confirm("Are you sure you want to delete your profile image?")) {
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const response = await fetch(`${API_URL}/api/user/profile/image`, {
        method: "DELETE",
        credentials: "include"
      });

      const result = await response.json();

      if (response.ok) {
        alert("Image deleted successfully!");
        await fetchProfile();
      } else {
        setUploadError(result.message || "Failed to delete image");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setUploadError("Error deleting image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (isLoading) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>User Profile</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>User Profile</h2>
        <p style={{ color: 'red' }}>Error: {error}</p>
        <button onClick={fetchProfile}>Retry</button>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>User Profile</h2>
        <p>No profile data available</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>User Profile</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <h3>Profile Information</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px", fontWeight: "bold" }}>ID:</td>
              <td style={{ padding: "10px" }}>{data._id}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px", fontWeight: "bold" }}>Email:</td>
              <td style={{ padding: "10px" }}>{data.email}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px", fontWeight: "bold" }}>First Name:</td>
              <td style={{ padding: "10px" }}>{data.firstname || 'Not set'}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px", fontWeight: "bold" }}>Last Name:</td>
              <td style={{ padding: "10px" }}>{data.lastname || 'Not set'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3>Profile Image</h3>
        
        {data.profileImage ? (
          <div style={{ marginBottom: "20px" }}>
            <img 
              src={`${API_URL}${data.profileImage}`} 
              alt="Profile" 
              style={{ 
                width: "200px", 
                height: "200px", 
                objectFit: "cover",
                border: "2px solid #ddd",
                borderRadius: "8px"
              }}
            />
            <br />
            <button 
              onClick={handleDeleteImage}
              disabled={uploading}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: uploading ? "not-allowed" : "pointer"
              }}
            >
              {uploading ? "Deleting..." : "Delete Image"}
            </button>
          </div>
        ) : (
          <p style={{ color: "#666", fontStyle: "italic" }}>No profile image uploaded</p>
        )}

        <div style={{ marginTop: "20px" }}>
          <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
            Upload New Profile Image:
          </label>
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/gif,image/webp"
            style={{ marginBottom: "10px" }}
          />
          <br />
          <button 
            onClick={handleImageUpload}
            disabled={uploading}
            style={{
              padding: "10px 20px",
              backgroundColor: uploading ? "#6c757d" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: uploading ? "not-allowed" : "pointer"
            }}
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
          {uploadError && (
            <p style={{ color: 'red', marginTop: "10px" }}>{uploadError}</p>
          )}
          <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
            Allowed formats: JPEG, PNG, GIF, WebP (Max size: 5MB)
          </p>
        </div>
      </div>

      <div style={{ marginTop: "30px" }}>
        <button 
          onClick={() => window.location.href = '/logout'}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}