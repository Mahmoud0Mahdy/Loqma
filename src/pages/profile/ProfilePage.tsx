import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { toast } from "sonner";
import { logoutApi } from "../../api/axiosInstance";
import { getUserProfile } from "../../api/userProfileApi";

import ProfileHeader from "./ProfileHeader";
import ProfileForm from "./ProfileForm";
import EditAccountModal from "./EditAccountModal";
import ChangePasswordModal from "./ChangePasswordModal";

export default function ProfilePage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] =
    useState(false);

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile();
      setProfile(data);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state.isAuthenticated) {
      fetchProfile();
    }
  }, [state.isAuthenticated]);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error(err);
    }

    dispatch({ type: "LOGOUT" });
    toast.success("Logged out");
    navigate("/login");
  };

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 relative top-[20px]">
      <div
        className="max-w-4xl mx-auto px-4 space-y-6"
        style={{ position: "relative", top: "20px" }}
      >
        <ProfileHeader
          user={profile}
          onLogout={handleLogout}
          onEdit={() => setOpenModal(true)}
          onChangePassword={() => setOpenChangePasswordModal(true)}
        />

        <ProfileForm
          profile={profile}
          setProfile={setProfile}
        />

        <EditAccountModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onUpdated={fetchProfile}
        />

        <ChangePasswordModal
          isOpen={openChangePasswordModal}
          onClose={() => setOpenChangePasswordModal(false)}
        />
      </div>
    </div>
  );
}