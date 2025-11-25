// src/components/ProductTable.jsx
export default function ProductTable({
  products,
  onEdit,
  onDelete,
  mapCategory,
}) {
  if (!products.length)
    return <p className="text-center p-4">No products found</p>;

  return products.map((group) => (
    <div
      key={group.category}
      className="bg-white rounded shadow overflow-x-auto mb-6"
    >
      <h3 className="text-lg font-semibold bg-gray-100 p-3 border-b">
        {group.category}
      </h3>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 text-left text-sm">ID</th>
            <th className="border p-2 text-left text-sm">Title</th>
            <th className="border p-2 text-left text-sm">Price</th>
            <th className="border p-2 text-left text-sm">Category</th>
            <th className="border p-2 text-left text-sm">Image</th>
            <th className="border p-2 text-left text-sm">Edit</th>
            <th className="border p-2 text-left text-sm">Delete</th>
          </tr>
        </thead>
        <tbody>
          {group.products.length > 0 ? (
            group.products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="border p-2 text-sm">{p.id}</td>
                <td className="border p-2 text-sm">{p.title}</td>
                <td className="border p-2 text-sm">${p.price}</td>
                <td className="border p-2 text-sm capitalize">
                  {mapCategory(p.category)}
                </td>
                <td className="border p-2 text-sm">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="border p-2 text-sm">
                  <button
                    onClick={() => onEdit(p)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 w-full"
                  >
                    Edit
                  </button>
                </td>
                <td className="border p-2 text-sm">
                  <button
                    onClick={() => onDelete(p.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 w-full"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center p-4 text-sm">
                No products in this category
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  ));
}
