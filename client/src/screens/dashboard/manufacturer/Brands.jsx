import React, { Profiler, useEffect, useState } from "react";
import axios from "axios";
import { Separator } from "@/components/ui/separator";
import {
  Delete,
  Edit,
  EllipsisVertical,
  ListCollapse,
  Mail,
  Share,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

function Brands() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/company/get-manufacturer`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setBrands(response.data.companies); // ✅ Fix key
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto w-full">
      <div className="sm:px-0 px-4 pb-16">
        <div className="w-fit">
          <h2 className="md:text-3xl text-xl font-bold mb-4 bg-gradient-to-r from-[#3b82f6] to-[#ff3333] text-transparent bg-clip-text">
            All Brands
          </h2>
        </div>
        {brands.length === 0 ? (
          <p>No brands found.</p>
        ) : (
          <div className="grid auto-rows-min gap-4 lg:grid-cols-3 md:grid-cols-2">
            {brands.map((company) => (
              <div key={company._id} className="border p-4 rounded shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-md font-medium leading-none">
                      {company.companyName}
                    </h3>
                    <p className="text-sm font-medium">
                      <strong>Description:</strong> {company.description || "—"}
                    </p>
                  </div>
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-none shadow-none"
                        >
                          <EllipsisVertical></EllipsisVertical>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" disabled>
                          <ListCollapse /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" disabled>
                          <Share /> Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                          <Delete /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex flex-col gap-1 mt-1">
                  <h1 className="uppercase text-xs">Created by</h1>
                  <p className="flex text-sm font-medium items-center gap-1">
                    <User className="h-5" /> {company.createdBy?.name || "—"}
                  </p>
                  <p className="flex text-sm font-medium items-center gap-1">
                    <Mail className="h-5" /> {company.createdBy?.email || "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Brands;
