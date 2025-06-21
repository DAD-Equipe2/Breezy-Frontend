import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";

import Navbar from "../../src/components/Navbar";
import PostCard from "../../src/components/PostCard";
import FollowButton from "../../src/components/FollowButton";
import ImageUploadButton from "../../src/components/ImageUploadButton";
import { AuthContext } from "../../src/context/AuthContext";
import { getProfile, updateProfile, deleteProfile } from "../../src/services/userService";

export default function ProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const { user: currentUser } = useContext(AuthContext);

  const [profileData, setProfileData] = useState({ user: null, posts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ bio: "", avatarURL: "" });
  const [selectedFile, setSelectedFile] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { logout } = useContext(AuthContext)


  useEffect(() => {
    if (!router.isReady) return;
    if (!id) {
      setError("Profil introuvable");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const { user, posts } = await getProfile(id);
        setProfileData({ user, posts });
        setEditForm({ bio: user.bio || "", avatarURL: user.avatarURL || "" });
      } catch (err) {
        setError(err.response?.data?.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    })();
  }, [router.isReady, id]);

  const handleEditChange = (e) =>
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      let avatarURL = editForm.avatarURL;
      if (selectedFile) {
        if (selectedFile.size > 5 * 1024 * 1024) {
          return alert("Le fichier dépasse 5 Mo");
        }
        const fd = new FormData();
        fd.append("avatar", selectedFile);
        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/profile/avatar`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("breezyToken")}`,
            },
            body: fd,
          }
        );
        const json = await uploadRes.json();
        if (json.success) {
          avatarURL = json.data.avatarURL;
        } else {
          return alert(json.message);
        }
      }
      const updatedUser = await updateProfile({ bio: editForm.bio, avatarURL });
      setProfileData(prev => ({ ...prev, user: updatedUser }));
      setIsEditing(false);
      setSelectedFile(null);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProfile();
      logout();
      localStorage.removeItem("breezyToken");
      router.replace("/");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  }

  if (loading) return <div>Chargement…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const { user, posts } = profileData;
  const isOwn = currentUser && currentUser._id === user._id;

  return (
    <>
      <div className="fixed inset-0 z-0 animate-bg-pan bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-300 bg-[length:300%_300%]"></div>
      <Navbar />
      <div className="relative max-w-2xl mx-auto mt-8 p-4 min-h-screen pt-20 z-10">
        <div className="flex items-center space-x-4">
          <img
            src={
              user.avatarURL
                ? `${process.env.NEXT_PUBLIC_API_URL}${user.avatarURL}`
                : "/default-avatar.png"
            }
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-sm text-gray-500">
              Inscrit le {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="ml-auto">
            {isOwn ? (
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-yellow-400 text-white rounded"
                  onClick={() => setIsEditing(true)}
                >
                  Modifier le profil
                </button>
                <button 
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Supprimer le profil
                </button>
              </div>              
            ) : (
              currentUser && <FollowButton targetUserId={user._id} />
            )}
          </div>
        </div>

        {user.bio && (
          <div className="mt-4 bg-gray-100 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-gray-800 whitespace-pre-line break-words ">{user.bio}</p>
          </div>
        )}

        {isOwn && isEditing && (
          <form
            onSubmit={handleEditSubmit}
            className="mt-4 space-y-4 bg-gray-50 p-4 rounded"
          >
            <h2 className="text-lg font-medium">Éditer votre profil</h2>
            <div>
              <label className="block font-medium">Bio :</label>
              <textarea
                name="bio"
                value={editForm.bio}
                onChange={handleEditChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <div className="flex flex-col items-center">
                <ImageUploadButton
                  value={selectedFile}
                  onChange={file => setSelectedFile(file)}
                  accept="image/*"
                />
                <span className="text-xs font-semibold text-blue-700 mt-2">Nouvel avatar</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Sauvegarder
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedFile(null);
                }}
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        <hr className="my-6" />

        <h2 className="text-xl font-semibold mb-4">
          Publications de {user.username}
        </h2>
        {posts.length === 0 ? (
          <p>Aucun post pour le moment.</p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} isOwn={isOwn} />)
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg p-6 max-w-sm w-full">
              <h2 className="text-lg font-bold mb-2">Supprimer le profil</h2>
              <p className="mb-4 text-gray-700">
                Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est <span className="font-semibold text-red-600">irréversible</span>.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Annuler
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded"
                  onClick={handleConfirmDelete}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
