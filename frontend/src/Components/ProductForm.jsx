export default function ProductForm({
    productName,
    brand,
    image,
    price,
    handleOnChange,
    handleOnSubmit,
    isEditing,
}) {
    return (
        <div>
            <form onSubmit={handleOnSubmit}>
                <input type="text" name="productName" value={productName} placeholder="Product Name" onChange={handleOnChange} required/>
                <br />
                <input type="text" name="brand" value={brand} placeholder="Brand" onChange={handleOnChange} required/>
                <br />
                <input type="text" name="image" value={image} placeholder="Image URL" onChange={handleOnChange} />
                <br />
                <input type="text" name="price" value={price} placeholder="Price" onChange={handleOnChange} required/>
                <br />
                <button type="submit">{isEditing? "Edit":"Add"} Product</button>
            </form>
        </div>
    )
}