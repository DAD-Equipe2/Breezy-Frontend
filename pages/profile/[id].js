'use client';

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";

import Navbar from "../../src/components/Navbar";
import PostCard from "../../src/components/PostCard";
import FollowButton from "../../src/components/FollowButton";
import ImageUploadButton from "../../src/components/ImageUploadButton";
import ProfileMenuBurger from "../../src/components/ProfileMenuBurger";
import { AuthContext } from "../../src/context/AuthContext";
import { getProfile, updateProfile, deleteProfile } from "../../src/services/userService";

export default function ProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const { user: currentUser, logout, setUser } = useContext(AuthContext);

  const [profileData, setProfileData] = useState({ user: null, posts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: "", bio: "", avatarURL: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const refreshProfile = async () => {
    if (!id) return;
    try {
      const { user, posts } = await getProfile(id);
      setProfileData({ user, posts });
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de rafraîchissement");
    }
  };

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
        setEditForm({ username: user.username || "", bio: user.bio || "", avatarURL: user.avatarURL || "" });
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
    if (!editForm.username.trim()) {
      return alert("Le nom de profil ne peut pas être vide.");
    }
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
            credentials: "include",
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

      const updateData = {
        username: editForm.username.trim(),
        bio: editForm.bio,
      }
      if (selectedFile) {
        updateData.avatarURL = avatarURL;
      }

      const updatedUser = await updateProfile(updateData);
      setProfileData(prev => ({ ...prev, user: updatedUser }));
      setIsEditing(false);
      setSelectedFile(null);

      if (setUser) setUser(updatedUser);
      await refreshProfile();

    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProfile();
      logout();
      router.replace("/");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDeletePost = (postId) => {
  setProfileData(prev => ({
    ...prev,
    posts: prev.posts.filter(p => p._id !== postId)
  }));
};

  if (loading) return <div className="text-foreground">Chargement…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const { user, posts } = profileData;
  const isOwn = currentUser && currentUser._id === user._id;
  return (
    <>
      <div className="fixed inset-0 z-0 animate-bg-pan bg-[linear-gradient(var(--grad-angle),var(--grad-from),var(--grad-to))] bg-[length:300%_300%]"></div>
      <Navbar />
      <div className="relative max-w-2xl mx-auto mt-8 p-4 min-h-screen pt-28 md:pt-20 z-10 text-foreground">
  
        <div className="relative bg-gradient-to-br from-neutral-50 via-blue-50 to-indigo-100 dark:from-neutral-900 dark:via-blue-950 dark:to-indigo-950 rounded-2xl shadow-xl p-6 flex flex-col items-center text-center space-y-4 mb-8 border border-blue-200/60 dark:border-blue-900/60">
          <img
            src={
              user.avatarURL
                ? `${process.env.NEXT_PUBLIC_API_URL}${user.avatarURL}`
                : "/default-avatar.png"
            }
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-blue-900 shadow-md bg-white dark:bg-blue-950"
          />

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
            {user.username}
            {(user.followers?.length > 4) && (
              <span
                className="inline-block align-middle"
                title="Compte certifié"
                aria-label="Compte certifié"
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="10" fill="#3897f0" stroke="#fff" strokeWidth="2"/>
                  <path d="M7.5 11.5l2.2 2.2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            )}
          </h1>

          <div className="flex justify-center space-x-6 text-sm text-gray-700 dark:text-gray-200 font-medium">
            <div>
              <span className="block text-lg font-bold text-black dark:text-white">{user.followers?.length || 0}</span>
              Abonnés
            </div>
            <div>
              <span className="block text-lg font-bold text-black dark:text-white">{user.following?.length || 0}</span>
              Abonnements
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <div className="w-1/2 h-px bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>

          {user.bio && (
            <div className="text-gray-800 dark:text-gray-200 max-w-lg text-sm leading-relaxed mt-2 w-full flex flex-col items-start px-0">
              <h2 className="font-semibold text-left w-full mb-1 px-4">Bio</h2>
              <p className="text-justify whitespace-pre-line break-all px-4">{user.bio}</p>
            </div>
          )}
          {isOwn ? (
            <div className="absolute top-3 right-3 z-10 flex gap-2">
              <ProfileMenuBurger
                onEdit={() => setIsEditing(true)}
                onDelete={() => setShowDeleteModal(true)}
              />
            </div>
          ) : (
            <div className="mt-4">
              <FollowButton targetUserId={user._id} onFollowChange={refreshProfile} />
            </div>
          )}
        </div>

        {isOwn && isEditing && (
          <>
            <div className="fixed inset-0 bg-black/30 dark:bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center"></div>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="w-full max-w-md mx-auto">
                <form
                  onSubmit={handleEditSubmit}
                  className="relative bg-white dark:bg-blue-950 border border-white/50 dark:border-blue-900/60 rounded-2xl shadow-2xl p-8 space-y-5"
                >
                  <button
                    type="button"
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedFile(null);
                    }}
                    aria-label="Fermer"
                  >
                    ×
                  </button>
                  <h2 className="text-lg font-bold text-center text-foreground">Éditer votre profil</h2>
                  <div>
                    <label className="block font-medium text-gray-700 dark:text-gray-200">Nom de profil :</label>
                    <input
                      type="text"
                      name="username"
                      value={editForm.username}
                      onChange={handleEditChange}
                      maxLength={30}
                      required
                      className="w-full border px-2 py-1 rounded bg-white dark:bg-blue-900 text-gray-900 dark:text-white"
                    />
                    <small className="text-gray-600 dark:text-gray-300">{editForm.username.length}/30</small>
                  </div>
                  <div>
                    <label className="block font-medium text-foreground dark:text-gray-200">Bio :</label>
                    <textarea
                      name="bio"
                      value={editForm.bio}
                      onChange={handleEditChange}
                      className="w-full border px-2 py-1 rounded bg-white/80 dark:bg-blue-900 text-foreground dark:text-white"
                      maxLength={100}
                    />
                    <small className="text-gray-600 dark:text-gray-300">{editForm.bio.length}/100</small>
                  </div>
                  <div>
                    <div className="flex flex-col items-center">
                      <ImageUploadButton
                        value={selectedFile}
                        onChange={file => {
                          if (file && file.target && file.target.files) {
                            setSelectedFile(file.target.files[0]);
                          } else {
                            setSelectedFile(file)
                          }
                          }
                        }
                        accept="image/*"
                      />
                      <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 mt-2">Nouvel avatar</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 justify-center">
                    <button type="submit" className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded">Sauvegarder</button>
                    <button type="button" className="px-4 py-2 bg-gray-300 dark:bg-gray-700 dark:text-white rounded" onClick={() => {
                      setIsEditing(false);
                      setSelectedFile(null);
                    }}>Annuler</button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}

        <hr className="my-6 border-white/50 dark:border-white/20" />
        <h2 className="text-xl font-semibold text-foreground mb-4">Publications de {user.username}</h2>
        {posts.length === 0 ? (
          <p className="text-foreground">Aucun post pour le moment.</p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} isOwn={isOwn} onDelete={handleDeletePost} />)
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-blue-950 text-foreground dark:text-white rounded shadow-lg p-6 max-w-sm w-full">
              <h2 className="text-lg font-bold mb-2">Supprimer le profil</h2>
              <p className="mb-4">
                Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est <span className="font-semibold text-red-600">irréversible</span>.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 dark:text-white rounded"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Annuler
                </button>
                <button
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
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
