import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Label,
  Modal,
  FileInput,
  TextInput,
  Textarea,
  Progress,
  Badge,
  BadgeProps,
} from "flowbite-react";
import {
  HiOutlineDocumentText,
  HiDownload,
  HiEye,
  HiPlus,
  HiUpload,
  HiPencil,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { FiFilter } from "react-icons/fi";
import { FileDropzone } from "../../components/UI/FiledropZone";
import { PageMeta } from "../../utils/app/pageMetaValues";
import axios from "../../config/axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import MultiSelect from "../../components/UI/MultiSelect";
import { formatDate } from "../../utils/app/time";
import { Skeleton } from "../../components/UI/Skeleton";
import { FaBookOpen } from "react-icons/fa";
import ConfirmationModal from "../../components/UI/ConfirmModal";
import { BsDatabase } from "react-icons/bs";
import { useDownloadFile } from "../../utils/api/download";

type Journal = {
  id: number;
  title: string;
  description: string;
  file_type: string;
  tags: string[];
  created_at: string;
  status: string;
  rejection_reason: string | null;
};

const colorMapping: Record<string, BadgeProps["color"]> = {
  approved: "success",
  rejected: "failure",
  pending: "warning",
};

const newJournalschema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  tag_ids: yup
    .array()
    .of(yup.string().required("tag is required"))
    .min(1, "At least one tag is required"),
  file: yup.mixed().required("File is required"),
});

const MyJournalPage = () => {
  const { downloadFile, downloading, progress } = useDownloadFile();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    register,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(newJournalschema),
    defaultValues: {
      file: undefined,
    },
  });

  const [selectedTag, setSelectedTag] = useState("All");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [filteredJournals, setFilteredJournals] = useState<Journal[]>([]);
  // const [uploadedFile, setUploadedFile] = useState<File[] | null>(null);
  const [tagsInput, setTagsInput] = useState("");

  const uploadedFile = watch("file") as FileList;
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [debounceValue, setDebounceValue] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [interests, setInterests] = useState<any[]>([]);
  const [uploadType, SetUploadType] = useState<"create" | "edit">("create");

  const handleUpload = async (data: any) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "file" && value) {
        formData.append(key, (value as FileList)?.[0]);
      } else if (key === "tag_ids") {
        (value as string[]).forEach((tag) => {
          formData.append(key, tag);
        });
      } else {
        formData.append(key, value as string);
      }
    });
    const url = `/user/resources/${uploadType === "edit" ? `${selectedJournal?.id}/` : ""}`;
    console.log(url);
    try {
      if (uploadType === "edit") {
        await axios.put(url, formData);
      } else {
        await axios.post(url, formData);
      }
      toast.success("Journal uploaded successfully!");
      closeUploadModal();
      fetchMyJournals();
    } catch (error: any) {
      console.error(error);
      toast.error(
        `Failed to upload journal. ${error.response.data.detail || error.message} `
      );
    }
  };

  // const handleTagFilter = (tag: string) => {
  //   setSelectedTag(tag);
  //   if (tag === "All") {
  //     setFilteredJournals(sampleJournals);
  //   } else {
  //     setFilteredJournals(
  //       sampleJournals.filter((journal) => journal.tags.includes(tag))
  //     );
  //   }
  // };

  const handleFiles = (files: File[] | FileList | null) => {
    if (files && files.length > 0) {
      setValue("file", files);
    }
  };

  const handleDownload = async (journal: any) => {
    setSelectedJournal(journal);
    console.log(journal.file.split("/"));
    await downloadFile(journal.id, journal.file.split("/")[3]);
  };

  const initializeEdit = (journal: Journal) => {
    const { title, description } = journal;
    setSelectedJournal(journal);
    reset({
      description,
      title,
      tag_ids: [],
      file: undefined,
    });
    SetUploadType("edit");
    setUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setSelectedJournal(null);
    reset();
    SetUploadType("create");
    setUploadModalOpen(false);
  };

  const fetchMyJournals = async () => {
    setIsFetching(true);
    try {
      // const {data} = await axios.get("/user/resources/")
      const [resourceResponse, interesetResponse] = await Promise.all([
        axios.get("/user/resources/"),
        axios.get("/interests/"),
      ]);
      console.log("this is ", resourceResponse.data);
      setFilteredJournals(resourceResponse.data.results);
      setTotalPages(resourceResponse.data.total_pages);
      setInterests(
        interesetResponse.data.map((int: any) => ({
          label: int.name,
          value: int.id,
        }))
      );
      setIsFetching(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyJournals();
  }, []);

  return (
    <>
      <PageMeta>
        <title>My Journal | LIPAN</title>
        <meta
          name="description"
          content="Upload, manage, and access your professional journals and activity documents."
        />
      </PageMeta>
      <div className="max-w- mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
              My Journal
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
              Access, upload, and manage your professional journals and activity
              documents.
            </p>
          </div>
          <Button
            disabled={isFetching}
            onClick={() => setUploadModalOpen(true)}
            color="blue"
          >
            <HiPlus className="mr-2 h-5" /> Upload Journal
          </Button>
        </div>

        <div className="min-h-[200px]">
          {isFetching ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-10 w-full my-4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <div className="p-4 space-y-2 mt-2">
                    <Skeleton className="h-2 w-4/4" />
                    <Skeleton className="h-2 w-2/4" />
                    <Skeleton className="h-2 w-3/4" />
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredJournals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredJournals.map((journal) => (
                <Card
                  key={journal.id}
                  className="shadow-sm border border-gray-200 dark:border-gray-700 relative"
                >
                  <Badge
                    color={colorMapping[journal.status]}
                    className="absolute -top-1 -right-1 text-xs"
                  >
                    {journal.status}
                  </Badge>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {journal.title}
                    </h3>
                    <span className="px-2 font-bold py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      {journal.file_type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                    Uploaded: {formatDate(journal.created_at)}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {journal.tags.map((tag: any, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  {journal.status === "rejected" && (
                    <Card className="mt-4 !p-0 rounded-2xl border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900 text-gray-800 dark:text-gray-100 shadow-sm space-y-3">
                      <div className="flex items-center gap-2 border-b border-red-200 dark:border-red-700 pb-2">
                        <HiOutlineExclamationCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <h3 className="text-lg font-semibold">
                          Rejection Notice
                        </h3>
                      </div>

                      <div className="flex items-start gap-2">
                        <HiOutlineDocumentText className="h-5 w-5 text-red-500 dark:text-red-300 mt-1" />
                        <div>
                          <p className="font-medium text-sm text-red-700 dark:text-red-200">
                            Reason for Rejection:
                          </p>
                          <p className="italic text-sm mt-1 text-red-800 dark:text-red-300">
                            {journal.rejection_reason || "No reason provided."}
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}
                  <div className="mt-4 flex gap-3">
                    {journal.status === "rejected" ? (
                      <Button
                        size="sm"
                        color="warning"
                        onClick={() => initializeEdit(journal)}
                      >
                        <HiPencil className="mr-1 h-5" /> Edit
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        color="gray"
                        onClick={() => handleDownload(journal)}
                      >
                        <HiDownload className="mr-1 h-5" /> Download
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center text-gray-500 dark:text-gray-400 py-12">
              <FaBookOpen className="mx-auto mb-2 text-blue-600" size={60} />
              <p className="text-lg font-medium">No journals found.</p>
            </Card>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Journal Guidelines
          </h2>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-1">
            <li>Only upload PDF or Word documents up to 10MB.</li>
            <li>Ensure your content is original and appropriate.</li>
            <li>Tag your journals properly to enhance discoverability.</li>
            <li>Use this page as your professional portfolio of works.</li>
          </ul>
        </div>

        {/* Upload Modal */}
        <Modal
          show={uploadModalOpen}
          onClose={() => !isSubmitting && closeUploadModal()}
          size="2xl"
          position="center"
        >
          <Modal.Header>
            {uploadType === "create" ? "Upload New Journal" : "Edit Journal"}
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(handleUpload)} className="space-y-5">
              <div>
                <Label htmlFor="title" value="Journal Title" />
                <TextInput
                  disabled={isSubmitting}
                  id="title"
                  placeholder="Enter title"
                  {...register("title")}
                  color={errors.title ? "failure" : undefined}
                  helperText={errors.title?.message}
                />
              </div>
              <div>
                <Label htmlFor="description" value="Journal Description" />
                <Textarea
                  disabled={isSubmitting}
                  id="description"
                  placeholder="Provide a brief Description / Explanatory of the journal"
                  {...register("description")}
                  rows={6}
                  color={errors.description ? "failure" : undefined}
                  helperText={errors.description?.message}
                />
              </div>
              <div>
                <Label value="Add Interest / Category tags to upload" />
                <MultiSelect<any>
                  labelKey="label"
                  valueKey="value"
                  options={interests}
                  onChange={(selected) => {
                    const selectedValues = selected.map(
                      (item: any) => item.value
                    );
                    setValue("tag_ids", selectedValues);
                  }}
                />
                {errors.tag_ids && (
                  <p className="text-sm text-red-500">
                    {errors.tag_ids.message}
                  </p>
                )}
              </div>
              <FileDropzone
                label="Select Upload"
                onFilesSelected={handleFiles}
              />
              {uploadedFile && Array.from(uploadedFile).length > 0 && (
                <ul className="space-y-2">
                  {Array.from(uploadedFile).map((file) => (
                    <li
                      key={file.name}
                      className="flex flex-wrap items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded-md"
                    >
                      <div className="flex items-center">
                        <HiUpload className="mr-2 text-blue-600" />
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {file.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 md:mt-0 md:ml-2">
                        {file.size < 1_000_000
                          ? `${Math.floor(file.size / 1_000)} KB`
                          : `${(file.size / 1_000_000).toFixed(2)} MB`}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <Button
                disabled={isSubmitting}
                isProcessing={isSubmitting}
                fullSized
                type="submit"
                color="blue"
                className="w-full"
              >
                Upload Journal
              </Button>
            </form>
          </Modal.Body>
        </Modal>

        <ConfirmationModal
          // onClose={() => !downloading && setOpenDownload(false)}
          // onConfirm={handleConfirmAction}
          open={downloading}
          title={"Downloading Journal Upload"}
          message={
            <div className="mt-4">
              <p className="!text-left text-sm text-gray-700 dark:text-gray-400">
                Downloading <b>{selectedJournal?.title}...</b>
              </p>
              <Progress
                progress={progress}
                progressLabelPosition="inside"
                size="lg"
                labelProgress
              />
            </div>
          }
          icon={BsDatabase}
          theme={"info"}
          showButtons={false}
        />
      </div>
    </>
  );
};

export default MyJournalPage;
