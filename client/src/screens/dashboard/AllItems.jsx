import React, { useEffect, useState } from 'react'
import axios from 'axios';

function AllItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/item/get-items", {
          withCredentials: true, // If you're using cookies for auth
        });

        if (res.data.success) {
          setItems(res.data.items);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <p>Loading items...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Items</h2>
      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item._id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{item.itemName}</h3>
              <p><strong>Description:</strong> {item.description || "—"}</p>
              <p><strong>Serial No:</strong> {item.serialNo}</p>
              <p><strong>Model:</strong> {item.model}</p>
              <p><strong>Status:</strong> {item.status}</p>
              <p>
                <strong>Manufacturer:</strong>{" "}
                {item.manufacturer?.companyName || "N/A"}
              </p>
              <div>
                <strong>Location(s):</strong>
                <ul className="list-disc ml-6">
                  {item.location?.map((loc) => (
                    <li key={loc._id}>
                      {loc.name} — {loc.description}
                    </li>
                  )) || <li>N/A</li>}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllItems