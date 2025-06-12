import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Label,
  Select,
  TextInput,
  Badge,
  Progress,
} from "flowbite-react";
import {
  HiOutlineDownload,
  HiOutlineDocumentSearch,
  HiOutlineEye,
} from "react-icons/hi";
import { BsJournalBookmark, BsInfoCircle, BsDatabase } from "react-icons/bs";
import { PageMeta } from "../../utils/app/pageMetaValues";
import axios from "../../config/axios";
import { useDownloadFile } from "../../utils/api/download";
import ConfirmationModal from "../../components/UI/ConfirmModal";
import { UserType } from "../../contexts/createContexts/auth";
import { formatDate } from "../../utils/app/time";
import { Skeleton } from "../../components/UI/Skeleton";
import { useApp } from "../../hooks/app";

type Resource = {
  id: number;
  title: string;
  file_type: string;
  owner: Partial<UserType>;
  created_at: string;
  filename: string;
  tags: any[];
};

const MyResourcesPage = () => {
  const { downloadFile, downloading, progress } = useDownloadFile();
  const { areasOfInterest } = useApp();

  const [selectedType, setSelectedType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouneValue, setDebounceValue] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [interest, setInterest] = useState<any[]>([]);

  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounceValue(searchTerm);
    }, 600);
    return () => clearTimeout(id);
  }, [searchTerm]);

  const fetchAvaliableResources = async () => {
    setIsFetching(true);
    try {
      // const { data } = await ;
      const [resourceRes, userDataRes] = await Promise.all([
        axios.get("/user/resources/?type=all", {
          params: {
            search: debouneValue,
            tags: selectedType,
          },
        }),
        axios.get("/auth/user/"),
      ]);
      const userInterest = userDataRes.data.areas_of_interest;
      const selectableInterest = areasOfInterest.filter((int: any) =>
        userInterest.includes(int.id)
      );
      setInterest(selectableInterest);
      setResources(resourceRes.data.results);
      console.log(resourceRes, userInterest, selectableInterest);
      setIsFetching(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAvaliableResources();
  }, [debouneValue, selectedType, areasOfInterest]);

  const handleDownload = async (resource: any) => {
    setSelectedResource(resource);
    console.log(resource.file.split("/"));
    await downloadFile(resource.id, resource.file.split("/")[3]);
  };

  return (
    <>
      <PageMeta>
        <title>My Resources | LIPAN</title>
        <meta
          name="description"
          content="Access and explore articles, journals, eBooks, and other resources."
        />
      </PageMeta>
      <div className="max-w-7xl mx-auto p-6 space-y-12">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            📚 My Resources
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
            Here are all the articles, journals, eBooks, and materials you
            currently have access to. Use filters and search to find what you
            need.
          </p>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-blue-50 dark:bg-blue-900 border-none">
            <div className="text-blue-800 dark:text-blue-200">
              <BsJournalBookmark className="text-2xl mb-2" />
              <h4 className="text-xl font-bold">Total Resources</h4>
              <p className="text-sm">
                You have access to {resources?.length} resources
              </p>
            </div>
          </Card>
          <Card className="bg-green-50 dark:bg-green-900 border-none">
            <div className="text-green-800 dark:text-green-200">
              <HiOutlineDocumentSearch className="text-2xl mb-2" />
              <h4 className="text-xl font-bold">Search & Filter</h4>
              <p className="text-sm">Quickly find the resources you need</p>
            </div>
          </Card>
          <Card className="bg-yellow-50 dark:bg-yellow-900 border-none">
            <div className="text-yellow-800 dark:text-yellow-200">
              <BsInfoCircle className="text-2xl mb-2" />
              <h4 className="text-xl font-bold">Support</h4>
              <p className="text-sm">
                Need help? Visit our FAQ or contact support
              </p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="w-full md:w-1/3">
            <Label htmlFor="type" value="Filter by Type" />
            <Select
              id="type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All</option>
              {interest.map((int: any, idx: number) => (
                <option key={idx} value={int.id}>
                  {int.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="w-full md:w-2/3">
            <Label htmlFor="search" value="Search Resources" />
            <TextInput
              id="search"
              placeholder="Search by title or owner"
              icon={HiOutlineDocumentSearch}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Resource Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isFetching ? (
            [...Array(6)].map((_, i) => (
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
            ))
          ) : resources.length > 0 ? (
            resources.map((res) => (
              <Card
                key={res.id}
                className="flex flex-col justify-between h-full shadow-md"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    {res.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {res.file_type.toUpperCase()} · {formatDate(res.created_at)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    By {res.owner.full_name}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {res.tags.map((tag) => (
                      <Badge key={tag.id} color="info" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    color="blue"
                    size="sm"
                    onClick={() => handleDownload(res)}
                  >
                    <HiOutlineDownload className="mr-2 h-5" /> Download
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center col-span-full text-gray-500 dark:text-gray-400 py-12">
              <p className="text-lg">No resources match your filter.</p>
            </div>
          )}
        </div>

        {/* Recent Access Activity */}
        {/* <div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            🕘 Recently Accessed
          </h2>
          <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <li>
              ✔️ <strong>"Mental Health in Youth"</strong> downloaded on March
              20, 2025
            </li>
            <li>
              ✔️ <strong>"Volunteer Impact Journal 2024"</strong> previewed on
              March 15, 2025
            </li>
            <li>
              ✔️ <strong>"Wellness for Families"</strong> downloaded on March
              10, 2025
            </li>
          </ul>
        </div> */}
      </div>

      <ConfirmationModal
        open={downloading}
        title={"Downloading Journal Upload"}
        message={
          <div className="mt-4">
            <p className="!text-left text-sm text-gray-700 dark:text-gray-400">
              Downloading <b>{selectedResource?.title}...</b>
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
    </>
  );
};

export default MyResourcesPage;
