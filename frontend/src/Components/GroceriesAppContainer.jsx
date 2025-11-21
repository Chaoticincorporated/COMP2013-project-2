import { useState, useEffect } from "react";
import axios from "axios";
import CartContainer from "./CartContainer";
import ProductsContainer from "./ProductsContainer";
import NavBar from "./NavBar";
import ProductForm from "./productForm";

export default function GroceriesAppContainer() {
  //States
  const [productData, setProductData] = useState([]);
  const [productForm, setProductForm] = useState({
    id: "",
    productName: "",
    brand: "",
    image: "",
    price: "",
    _id:"",
  });
  const [formResponse, setFormResponse] = useState();
  const [productQuantity, setProductQuantity] = useState([]);
  const [cartList, setCartList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  //useEffects
  useEffect(()=>{
    handleProductsDB();
  }, [formResponse]);
  //Handlers
  //Handler for increasing quantity
  const handleAddQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };
  //Handler for lowering quantity
  const handleRemoveQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId && product.quantity > 1) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId && product.quantity > 0) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };
  //Handler for adding an item to the cart
  const handleAddToCart = (productId) => {
    const product = productData.find((product) => product.id === productId);
    const pQuantity = productQuantity.find(
      (product) => product.id === productId
    );
    const newCartList = [...cartList];
    const productInCart = newCartList.find(
      (product) => product.id === productId
    );
    if (productInCart) {
      productInCart.quantity += pQuantity.quantity;
    } else if (pQuantity.quantity === 0) {
      alert(`Please select quantity for ${product.productName}`);
    } else {
      newCartList.push({ ...product, quantity: pQuantity.quantity });
    }
    setCartList(newCartList);
  };
//Handler for removing item from cart
  const handleRemoveFromCart = (productId) => {
    const newCartList = cartList.filter((product) => product.id !== productId);
    setCartList(newCartList);
  };
  //Handler for clearing the cart
  const handleClearCart = () => {
    setCartList([]);
  };
  //Handler for grabbing products from database
  const handleProductsDB = async() => {
    
    try{
      const response = await axios.get("http://localhost:3000/products");
      setProductData(response.data);
      setProductQuantity(response.data.map((product) => (
      { id: product.id, quantity: 0 }
      )));
    }catch(error){
      console.log(error.message);
    }
  }
  //Handler for resetting the form
  const handleResetForm = () => {
    setProductForm({
            id: "",
            productName: "",
            brand: "",
            image: "",
            price: "",
          })
  }
  //Handler for submitting a new product
  const handleOnSubmit = async (e)=>{
    e.preventDefault();
    console.log(productForm);
    try{
      if(isEditing){
        handleOnUpdate(productForm._id)
        handleResetForm();
        setIsEditing(false);
      }else{
        await axios
        .post("http://localhost:3000/products", productForm)
        .then((response)=>setFormResponse(response.data.message))
        .then(()=>handleResetForm()
          );
      }
      
    }catch(error){
      console.log(error.message);
    }
  };
  //Handler for when form input changes
  const handleOnChange = (e) => {
    setProductForm((prevData)=>{
      return {...prevData, [e.target.name]: e.target.value}
    });
  };
  //Handler for deleting products
  const handleOnDelete = async(_id)=>{
    try{
      const response = await axios.delete(`http://localhost:3000/products/${_id}`);
      setFormResponse(response.data.message);
    }catch(error){
      console.log(error.message);
    }
  }
  //Handler for editing products
  const handleOnEdit = async(_id)=>{
    try{
      const productToRdit = await axios.get(`http://localhost:3000/products/${_id}`);
      console.log(productToRdit);
      setProductForm({
        id: productToRdit.data.id,
        productName: productToRdit.data.productName,
        brand: productToRdit.data.brand,
        image: productToRdit.data.image,
        price: productToRdit.data.price,
        _id: productToRdit.data._id,
      });
      setIsEditing(true);
    }catch(error){
      console.log(error.message);
    }
  }
  //handles updating the api patch route
  const handleOnUpdate = async(_id)=>{
    try{
      const result = await axios.patch(`http://localhost:3000/products/${_id}`, productForm);
      setFormResponse(result.data.message);
    }catch(error){
      console.log(error);
    }
  }
  //Renders
  return (
    <div>
      <NavBar quantity={cartList.length} />
      <div className="GroceriesApp-Container">
        <ProductForm
          productName={productForm.productName}
          brand={productForm.brand}
          image={productForm.image}
          price={productForm.price}
          handleOnChange={handleOnChange}
          handleOnSubmit={handleOnSubmit}
          isEditing={isEditing}
        />
        <ProductsContainer
          products={productData}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          productQuantity={productQuantity}
          handleOnDelete={handleOnDelete}
          handleOnEdit={handleOnEdit}
        />
        <CartContainer
          cartList={cartList}
          handleRemoveFromCart={handleRemoveFromCart}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleClearCart={handleClearCart}
        />
      </div>
    </div>
  );
}
