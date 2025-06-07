import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import ProductCard from "./components/ProductCard"
import Modal from "./components/ui/Modal"
import { categories, colors, formInputsList, productList } from "./data"
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import { IProduct } from "./interfaces";
import { productValidation } from "./validation";
import ErrorMessage from "./components/ErrorMessage";
import CircleColor from "./components/CircleColor";
import { v4 as uuid } from "uuid";
import Select from "./components/ui/Select";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

const App = () => {
  const defaultProductObject = {
    title: '',
    description: '',
    imageURL: '',
    price: '',
    colors: [],
    category: {
      name: '',
      imageURL: ''
    }
  }

  const [products, setProducts] = useState<IProduct[]>(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : productList;
  });
  const [product, setProduct] = useState<IProduct>(defaultProductObject);
  const [errors, setErrors] = useState({ title: "", description: "", imageURL: "", price: "", colors: "" });
  const [tempColors, setTempColor] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const resetForm = () => {
    setProduct(defaultProductObject);
    setTempColor([]);
    setSelectedCategory(categories[0]);
    setErrors({ title: "", description: "", imageURL: "", price: "", colors: "" });
    setIsEdit(false);
  };

  const handleClose = () => {
    resetForm();
    close();
  };

  useEffect(() => {
    try {
      localStorage.setItem('products', JSON.stringify(products));
    } catch (error) {
      console.error('Failed to save products to localStorage:', error);
    }
  }, [products]);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setProduct({ ...product, [name]: value });
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const onCancel = () => {
    resetForm();
    close();
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const { title, description, price, imageURL } = product;
    const errors = productValidation({ title, description, price, imageURL, colors: tempColors });

    const hasErrors = Object.values(errors).some(msg => msg !== "");
    if (hasErrors) {
      setErrors(errors);
      return;
    }

    if (isEdit) {
      setProducts(prev =>
        prev.map(p => p.id === product.id
          ? { ...product, colors: tempColors, category: selectedCategory }
          : p
        )
      );
      await Swal.fire({
        title: 'Success!',
        text: 'Product updated successfully!',
        icon: 'success',
        confirmButtonColor: '#4f46e5',
        confirmButtonText: 'OK'
      });
    } else {
      const newProduct = {
        ...product,
        id: uuid(),
        colors: tempColors,
        category: selectedCategory
      };
      setProducts(prev => [newProduct, ...prev]);
      await Swal.fire({
        title: 'Success!',
        text: 'Product added successfully!',
        icon: 'success',
        confirmButtonColor: '#4f46e5',
        confirmButtonText: 'OK'
      });
    }

    resetForm();
    close();
  };

  const onEdit = (product: IProduct) => {
    setProduct({
      id: product.id,
      title: product.title,
      description: product.description,
      imageURL: product.imageURL,
      price: product.price.toString(),
      colors: product.colors,
      category: product.category
    });
    setTempColor([...product.colors]);
    setSelectedCategory(product.category);
    setIsEdit(true);
    open();
  };

  const onDelete = async (productId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      await Swal.fire('Deleted!', 'Product has been deleted.', 'success');
    }
  };

  const renderProductList = products.map(product => (
    <ProductCard
      key={product.id}
      product={product}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  ));

  const renderFormInputList = formInputsList.map(input => (
    <div className="flex flex-col" key={input.id}>
      <label htmlFor={input.id} className="mb-[1px] text-sm font-medium text-gray-700">{input.label}</label>
      <Input type="text" id={input.id} name={input.name} value={product[input.name]} onChange={onChangeHandler} />
      <ErrorMessage msg={errors[input.name]} />
    </div>
  ));

  const renderProductColors = colors.map(color => (
    <CircleColor
      key={color}
      color={color}
      onClick={() => {
        setTempColor(prev =>
          prev.includes(color)
            ? prev.filter(c => c !== color)
            : [...prev, color]
        );
      }}
    />
  ));

  return (
    <main className="container mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between p-5 m-5 bg-white rounded-lg border border-gray-200 space-y-3">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">Create and Manage Products</h1>
        <Button
          className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2 px-4 rounded-md"
          width="w-fit"
          onClick={open}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Product</span>
        </Button>
      </div>

      <div className="m-3 md:m-4 lg:m-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 rounded-md">
        {renderProductList}
      </div>

      <Modal isOpen={isOpen} close={handleClose} title={isEdit ? "EDIT PRODUCT" : "ADD A NEW PRODUCT"}>
        <form className="space-y-4" onSubmit={submitHandler}>
          {renderFormInputList}

          <div className="space-y-4 mb-0">
            <Select selected={selectedCategory} setSelected={setSelectedCategory} />
            <div className="flex flex-wrap gap-1">{renderProductColors}</div>
            <div className="flex flex-wrap gap-1">
              {tempColors.map(color => (
                <span key={color} className="px-2 py-1 text-xs font-medium rounded-full text-white" style={{ backgroundColor: color }}>
                  {color}
                </span>
              ))}
            </div>
            <ErrorMessage msg={errors.colors} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2">
              {isEdit ? 'Update' : 'Submit'}
            </Button>
            <Button type="button" onClick={onCancel} className="bg-gray-500 hover:bg-gray-600 px-4 py-2">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </main>
  );
};

export default App;