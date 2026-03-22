import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Box, DollarSign, ListTree } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import ImageUpload from '../components/ImageUpload';

const UpdateProductModal = ({ isOpen, onClose, product, onUpdateSuccess }) => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  // Fill the form with existing product data when modal opens
  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("category", product.category);
      setValue("price", product.price);
      setValue("stockQuantity", product.stockQuantity);
      setValue("description", product.description);
      setUploadedImageUrl(product.imageUrl);
    }
  }, [product, setValue]);

  const onSubmit = async (data) => {
    const loadingToast = toast.loading("Updating Registry...");
    const updatedData = { ...data, imageUrl: uploadedImageUrl };

    try {
      const response = await fetch(`http://localhost:8080/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        toast.success("Asset Updated Successfully", { id: loadingToast });
        onUpdateSuccess(); // Refresh the list
        onClose();
      }
    } catch (error) {
      toast.error("Database Connection Failure", { id: loadingToast });
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-end bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ x: 500 }} animate={{ x: 0 }} exit={{ x: 500 }}
        className="w-full max-w-lg h-full bg-[#080808] border-l border-[#D4AF37]/20 p-12 relative shadow-[-20px_0_50px_rgba(0,0,0,0.5)] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <header className="mb-12">
          <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-2">Modify Asset</p>
          <h2 className="text-4xl font-black uppercase tracking-tighter">Edit Inventory</h2>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <ImageUpload onUploadSuccess={(url) => setUploadedImageUrl(url)} />

          <InputGroup label="Product Name" icon={<Box size={16}/>} register={register("name")} />
          <InputGroup label="Category" icon={<ListTree size={16}/>} register={register("category")} />
          
          <div className="grid grid-cols-2 gap-6">
            <InputGroup label="Unit Price" icon={<DollarSign size={16}/>} register={register("price")} type="number" />
            <InputGroup label="Quantity" icon={<Box size={16}/>} register={register("stockQuantity")} type="number" />
          </div>

          <div className="group">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-3">Specifications</label>
            <textarea 
              {...register("description")}
              className="w-full bg-white/5 border border-white/10 p-4 focus:border-[#D4AF37] outline-none transition-all text-sm h-32"
            />
          </div>

          <button className="w-full bg-[#D4AF37] text-black font-black py-5 tracking-[0.4em] uppercase flex items-center justify-center gap-3 hover:bg-[#E5C158] transition-all">
            <Save size={20} /> Commit Changes
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Reusable Input Component
const InputGroup = ({ label, icon, register, type = "text" }) => (
  <div className="group">
    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-3">{label}</label>
    <div className="relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[#D4AF37]/50 group-focus-within:text-[#D4AF37] transition-colors">{icon}</div>
      <input 
        {...register} type={type}
        className="w-full bg-transparent border-b border-white/10 pl-8 py-3 focus:border-[#D4AF37] outline-none transition-all text-sm uppercase tracking-widest"
      />
    </div>
  </div>
);

export default UpdateProductModal;