import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const syllabus = [
  {
    id: "01",
    content:
      "1. Special qualities and attitudes to be developed by a Beautician",
    code: "093S001BM01",
    duration: 12,
    page: 37,
  },
  {
    id: "02",
    content: "2. Maintenance of Machinery Tools and Equipment",
    code: "093S001BM02",
    duration: 18,
    page: 38,
  },
  {
    id: "03",
    content: "3. Occupational Health and Safety Procedures and Practice",
    code: "093S001BM03",
    duration: 36,
    page: 39,
  },
  {
    id: "04",
    content: "4. Maintenance of safe and pleasant Beauty salon environment",
    code: "093S001TM01",
    duration: 12,
    page: 40,
  },
  {
    id: "05",
    content: "5. Reception Duties",
    code: "093S001TM02",
    duration: 18,
    page: 41,
  },
  {
    id: "06",
    content: "  6. Client Consultation",
    code: "093S001TM03",
    duration: 18,
    page: 42,
  },
  {
    id: "07",
    content: "7. Superfluous Hair Removal",
    code: "093S001TM04",
    duration: 30,
    page: 43,
  },
  {
    id: "08",
    content: "8. Make-Up Application",
    code: "093S001TM05",
    duration: 48,
    page: 44,
  },
  {
    id: "09",
    content: "9. Manicure and pedicure",
    code: "093S001TM06",
    duration: 88,
    page: 45,
  },
  {
    id: "10",
    content: "10. Skin analysis",
    code: "093S001TM07",
    duration: 24,
    page: 46,
  },
  {
    id: "11",
    content: "11. Skin care treatments",
    code: "093S001TM08",
    duration: 138,
    page: 47,
  },
  {
    id: "12",
    content: "12. Salon Management",
    code: "On the Job Period",
    duration: "6 months",
    page: "",
  },
];

export function Intrduction() {
  const navigate = useNavigate();
  const handleEditClick = (id: string) => {
    navigate(`/edit`);
  };

  return (
    <div>
      <div>
        <div className="text-center font-bold text-indigo-950 mt-12 mb-8">
          Intoduction
        </div>
        <div className="pl-10 pr-10 mb-3 text-gray-500 dark:text-gray-400 first-letter:text-7xl first-letter:font-bold first-letter:text-gray-900 dark:first-letter:text-gray-100 first-letter:me-3 first-letter:float-start">
          Welcome to Bliss2Glamour, your gateway to a world of beauty and
          confidence. We're a unique online platform dedicated to empowering
          individuals to embrace their natural beauty. Whether you're an
          aspiring beautician preparing for the NVQ Level 4 examination, a
          seasoned professional seeking to enhance your skills, or simply
          looking to improve your skincare routine, Bliss2Glamour offers a
          wealth of free resources, including interactive quizzes, practical
          tutorials, and personalized skincare advice. Join our supportive
          community, connect with like-minded individuals, and embark on a
          journey of self-discovery and beauty.
        </div>
      </div>
      <div className="text-center font-bold text-indigo-950 mt-12">
        NVQ Level 4 Beauty Exam Syllabus
      </div>
      <div className="pl-10 pr-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Content</TableHead>
              <TableHead>Competency Code No.</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Page No.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {syllabus.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.content}</TableCell>
                <TableCell>{item.code} </TableCell>
                <TableCell>{item.duration}</TableCell>
                <TableCell>{item.page}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
<div className="border-t-2 border-black-200 mt-8 p-8 flex">
  <div className="text-center font-bold text-indigo-950 mb-4 ml-4 mr-4 mt-2">
    Contact Us :
  </div>
  <a 
    href="https://chat.whatsapp.com/J1MwXiBqTHD6ChKBDq2Hea" 
    target="_blank" 
  
    //className="inline-block mt-4 hover:opacity-75 transition-opacity"
  >
    <img 
      src="/pngtree-whatsapp.png" 
      className="h-10 w-10 cursor-pointer"   
      width={50}
      height={50}
    />
  </a>
</div>
      </div>
    </div>
  );
}
