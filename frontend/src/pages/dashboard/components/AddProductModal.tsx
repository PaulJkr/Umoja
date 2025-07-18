import React, { useState, Dispatch, SetStateAction } from "react";
import { useAddProduct } from "../../../services/product";
import { toast } from "sonner";
import { Loader2, ImageIcon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

interface AddProductModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const AddProductModal = ({ open, setOpen }: AddProductModalProps) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "produce", // merged type+category into one
    harvestDate: "",
    certification: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { mutate: addProduct, isPending } = useAddProduct();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("quantity", form.quantity);
    formData.append("type", form.category); // Send as `type` to match backend
    formData.append("harvestDate", form.harvestDate);
    formData.append("certification", form.certification);
    if (file) {
      formData.append("imageUrl", file);
    }

    addProduct(formData, {
      onSuccess: () => {
        toast.success("✅ Product added successfully!");
        setForm({
          name: "",
          price: "",
          quantity: "",
          category: "produce",
          harvestDate: "",
          certification: "",
        });
        setFile(null);
        setPreview(null);
        setOpen(false);
      },
      onError: () => {
        toast.error("❌ Failed to add product. Please try again.");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Add a New Product
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-4 rounded-xl"
        >
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="produce">Produce</option>
              <option value="seed">Seed</option>
              <option value="fertilizer">Fertilizer</option>
            </select>
          </div>

          <div>
            <Label htmlFor="harvestDate">Harvest Date</Label>
            <Input
              id="harvestDate"
              name="harvestDate"
              type="date"
              value={form.harvestDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="certification">Certification</Label>
            <Input
              id="certification"
              name="certification"
              value={form.certification}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 rounded-lg w-full h-40 object-cover border"
              />
            ) : (
              <div className="mt-2 w-full h-40 flex items-center justify-center border rounded-lg text-gray-400">
                <ImageIcon className="h-10 w-10" />
              </div>
            )}
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Submitting...
              </>
            ) : (
              "Add Product"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
