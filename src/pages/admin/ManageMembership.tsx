import React, { useEffect, useState } from "react";
import {
  Button,
  Label,
  TextInput,
  Textarea,
  Spinner,
  Card,
  Tooltip,
  Checkbox,
} from "flowbite-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../../config/axios";
import { toast } from "react-toastify";
import {
  FaInfoCircle,
  FaEdit,
  FaPlus,
  FaMoneyBillWave,
  FaListUl,
} from "react-icons/fa";
import { HiArrowCircleLeft } from "react-icons/hi";
import SelectableSection from "../../components/UI/SelectionCard";
import { errorHandler } from "../../utils/api/errors";

const membershipSchema = yup.object({
  name: yup.string().required("Plan name is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required"),
  permissions: yup.array().min(1, "At least one benefit is required"),
});

type MembershipSchemaType = yup.InferType<typeof membershipSchema>;

function MembershipFormSkeleton() {
  return (
    <div className="max-w-3xl mx-auto p-6 animate-pulse space-y-4">
      <div className="h-8 bg-gray-300 rounded w-2/5"></div>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 rounded-md" />
      ))}
    </div>
  );
}

export default function MembershipCreateEditPage() {
  const { value } = useParams<{ value: string }>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<MembershipSchemaType>({
    resolver: yupResolver(membershipSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      permissions: [],
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState<any[]>([]);

  const isEditing = value && value !== "create";

  useEffect(() => {
    const fetchMembership = async () => {
      setIsLoading(true);
      try {
        if (isEditing) {
          const { data } = await axios.get(`/membership/${value}/`);
          reset({
            name: data.name,
            description: data.description,
            price: data.price,
            permissions: data.permissions.map((p: any) => p.key),
          });
        }
        const { data: permissionsList } = await axios.get(
          "/membership/permission-list/"
        );
        setPermissions(
          permissionsList.map((item: any) => ({
            id: item.key,
            label: item.label,
          }))
        );
      } catch {
        toast.error("Failed to load membership plan");
        navigate("/admin/memberships");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembership();
  }, [value, reset, navigate, isEditing]);

  const onSubmit = async (data: MembershipSchemaType) => {
    try {
      if (isEditing) {
        await axios.put(`/membership/${value}/`, data);
        toast.success("Membership plan updated successfully!");
      } else {
        await axios.post("/membership/", data);
        toast.success("Membership plan created successfully!");
        reset({
          name: "",
          description: "",
          price: 0,
          permissions: [],
        });
        navigate("/admin/memberships");
      }
    } catch (error: any) {
      const errMsg = errorHandler(error);
      toast.error(errMsg || "Failed to save membership plan");
    }
  };

  if (isLoading) return <MembershipFormSkeleton />;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button color="light" as={Link} to="/admin/memberships">
          <HiArrowCircleLeft className="h-5 mr-2" />
          Back
        </Button>
        <Tooltip content="All fields are required. Pricing is in ₦.">
          <FaInfoCircle className="text-gray-500 text-xl cursor-pointer" />
        </Tooltip>
      </div>

      <div className="flex items-center gap-3 text-2xl font-bold text-gray-800 dark:text-gray-100">
        {isEditing ? (
          <>
            <FaEdit className="text-blue-500" />
            Editing: Membership Plan
          </>
        ) : (
          <>
            <FaPlus className="text-green-500" />
            Create a New Membership Plan
          </>
        )}
      </div>

      <Card className="shadow-md p-6 border border-gray-100 dark:border-gray-700">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" value="Plan Name" />
            <TextInput
              icon={FaListUl}
              id="name"
              placeholder="e.g., Premium Access"
              {...register("name")}
              color={errors.name ? "failure" : undefined}
              helperText={errors.name?.message}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" value="Price (₦)" />
            <TextInput
              icon={FaMoneyBillWave}
              id="price"
              type="number"
              placeholder="Enter price in Naira"
              {...register("price")}
              color={errors.price ? "failure" : undefined}
              helperText={errors.price?.message}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" value="Description" />
            <Textarea
              id="description"
              placeholder="Describe the benefits of this membership plan..."
              rows={4}
              {...register("description")}
              color={errors.description ? "failure" : undefined}
              helperText={errors.description?.message}
              disabled={isSubmitting}
            />
            <p className="text-sm text-gray-500">
              This will help users understand what they get.
            </p>
          </div>

          <div className="space-y-2">
            <Label value="Membership Benefits" />
            <SelectableSection
              options={permissions}
              multiple
              value={watch("permissions") as string[]}
              onChange={(val) => setValue("permissions", val as string[])}
              renderItem={(item, isSelected) => (
                <div className="flex items-center gap-3 px-3 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all">
                  <Checkbox color="blue" checked={isSelected} readOnly />
                  <span className="text-sm text-gray-800 dark:text-gray-100">
                    {item.label}
                  </span>
                </div>
              )}
            />
            {errors.permissions && (
              <p className="text-sm text-red-500">
                {errors.permissions.message}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              color="blue"
              disabled={isSubmitting}
              size="md"
              fullSized
            >
              {isSubmitting ? (
                <Spinner size="sm" />
              ) : isEditing ? (
                "Update Plan"
              ) : (
                "Create Plan"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
