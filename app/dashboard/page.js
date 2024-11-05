"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, firestore } from "../lib/firebase";
import { AddNewButton } from "../components/AddNewButton";
import { Modal } from "../components/Modal";
import { Table } from "../components/Table";
import DashboardLayout from "../components/DashboardLayout";
import { deleteLocalFile } from "../upload";
import { PlaceholderLoading } from "../components/PlaceholderLoading";

export default function DashboardPage() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [edititable, setEditable] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      } else {
        fetchData();
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(
        collection(firestore, "QR_Generator")
      );
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (item) => {
    let r = confirm("Are you sure you want to delete!");
    if (!r) {
      return;
    }
    setIsLoading(true);
    await deleteDoc(doc(firestore, "QR_Generator", item.id));
    const files = [item?.qrImage, item?.video, item?.marker];
    files.forEach(async (file) => {
      if (file) {
        await deleteLocalFile(file, item.id);
      }
    });
    fetchData();
    setIsLoading(false);
  };
  const handleEdit = async (id) => {
    const findData = data.find((data) => data.id === id);
    setEditable(findData);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
          Dashboard
        </h1>
        <AddNewButton onClick={() => setIsModalOpen(true)} />
        {isLoading ? (
          <PlaceholderLoading />
        ) : (
          <Table data={data} onDelete={handleDelete} onEdit={handleEdit} />
        )}
        {isModalOpen && (
          <Modal
            onClose={() => {
              setIsModalOpen(false);
              setEditable(null);
            }}
            onSuccess={fetchData}
            edititable={edititable}
            setEditable={setEditable}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
