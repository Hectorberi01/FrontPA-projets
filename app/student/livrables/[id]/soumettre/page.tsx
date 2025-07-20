"use client";
import { useParams } from "next/navigation";
import {useEffect, useState} from "react";
import { deliverableService } from "@/lib/services/livrables";

export default function DeliverableSubmissionForm() {
  const { id } = useParams<{ id: string }>();
  const [file, setFile] = useState<File | null>(null);
  const [gitLink, setGitLink] = useState("");
  const [projectId, setProjectId] = useState("1");
  const [groupId, setGroupId] = useState("2");
  const [name, setName] = useState("Livrable 1");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!file && gitLink.trim() === "") {
      setMessage("Veuillez choisir un fichier ou un lien Git.");
      setMessageType("error");
      return;
    }

    const formData = new FormData();
    formData.append("projectId", projectId);
    formData.append("groupId", groupId);
    formData.append("name", name);
    formData.append("description", description);
    if (file) formData.append("file", file);
    if (gitLink.trim() !== "") formData.append("githubUrl", gitLink.trim());

    try {
      setLoading(true);
      const result = await deliverableService.submitDeliverable(formData);
      setMessage("Soumission réussie !");
      setMessageType("success");
      console.log("Résultat :", result);
      
      // Reset form on success
      setFile(null);
      setGitLink("");
      setDescription("");
    } catch (err: any) {
      setMessage(`Erreur : ${err.message}`);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (message && messageType === "error") {
      setMessage("");
      setMessageType("");
    }
  };

  const handleGitLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGitLink(e.target.value);
    if (message && messageType === "error") {
      setMessage("");
      setMessageType("");
    }
  };
  useEffect(() => {
      const getprojetdetails = async ()=>{
        const projetString = localStorage.getItem("selectedProject");
        const groupIdSting = localStorage.getItem("groupId");
        if(projetString === null) return [];
        if (groupIdSting === null) return [];
        const projetData = JSON.parse(projetString);
        const groupId = JSON.parse(groupIdSting);

        setGroupId(groupId);
        setProjectId(projetData.id)

      }

      getprojetdetails();
  },[])
 return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Soumettre un livrable
            </h1>
            <p className="text-gray-600">
              Téléchargez votre fichier ou partagez un lien vers votre dépôt Git
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du livrable *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID du projet
                </label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                placeholder="Décrivez votre livrable..."
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Méthode de soumission
              </h3>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700">
                        Télécharger un fichier ZIP
                      </div>
                      <div className="text-xs text-gray-500">
                        Fichier compressé contenant votre projet
                      </div>
                    </div>
                  </label>
                  <input
                    type="file"
                    accept=".zip"
                    onChange={handleFileChange}
                    className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                  />
                  {file && (
                    <div className="mt-2 text-sm text-green-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}
                </div>

                <div className="text-center text-gray-500 font-medium">OU</div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span>Lien vers le dépôt Git</span>
                    </div>
                  </label>
                  <input
                    type="url"
                    value={gitLink}
                    onChange={handleGitLinkChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="https://github.com/utilisateur/repository"
                  />
                </div>
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-md flex items-center space-x-2 ${
                messageType === "success" 
                  ? "bg-green-50 border border-green-200 text-green-800" 
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}>
                {messageType === "success" ? (
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
                <span className="font-medium">{message}</span>
              </div>
            )}

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <span>Soumettre le livrable</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}