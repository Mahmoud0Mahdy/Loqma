import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import { updateUserProfile, getUserProfile } from "../../api/userProfileApi"; // 👈 ضيفنا دي

export default function ProfileForm({ profile, setProfile }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(profile);

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  const handleSave = async () => {
    try {
      // update
      await updateUserProfile(form);

      const freshData = await getUserProfile();

      setProfile(freshData);
      setForm(freshData);

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Personal Information
      </h2>

      <div className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1 block">
              Full Name
            </Label>
            <Input
              value={form?.fullName || ""}
              disabled
              className="h-11 border-2 border-gray-300 rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1 block">
              Email
            </Label>
            <Input
              value={form?.email || ""}
              disabled
              className="h-11 bg-gray-100 border border-gray-200 text-gray-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1 block">
              Phone
            </Label>
            <Input
              value={form?.phone || ""}
              disabled={!isEditing}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="h-11 border-2 border-gray-300 rounded-lg bg-white
              focus:border-green-600 focus:ring-2 focus:ring-green-200"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1 block">
              Address
            </Label>
            <Input
              value={form?.address || ""}
              disabled={!isEditing}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="h-11 border-2 border-gray-300 rounded-lg bg-white
              focus:border-green-600 focus:ring-2 focus:ring-green-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1 block">
              City
            </Label>
            <Input
              value={form?.city || ""}
              disabled={!isEditing}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="h-11 border-2 border-gray-300 rounded-lg bg-white
              focus:border-green-600 focus:ring-2 focus:ring-green-200"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1 block">
              State
            </Label>
            <Input
              value={form?.state || ""}
              disabled={!isEditing}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="h-11 border-2 border-gray-300 rounded-lg bg-white
              focus:border-green-600 focus:ring-2 focus:ring-green-200"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1 block">
              Zip Code
            </Label>
            <Input
              value={form?.zipCode || ""}
              disabled={!isEditing}
              onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
              className="h-11 border-2 border-gray-300 rounded-lg bg-white
              focus:border-green-600 focus:ring-2 focus:ring-green-200"
            />
          </div>
        </div>

      </div>

      <div className="mt-8 flex justify-center gap-3">

        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-full"
          >
            Edit Profile
          </Button>
        )}

        {isEditing && (
          <>
            <Button
              onClick={() => {
                setIsEditing(false);
                setForm(profile);
              }}
              variant="outline"
              className="rounded-full px-6"
            >
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-full"
            >
              Save
            </Button>
          </>
        )}
      </div>

    </div>
  );
}