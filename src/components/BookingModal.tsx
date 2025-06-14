
import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const [courseType, setCourseType] = useState("Regular");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">Book your counselling slot now!</DialogTitle>
                <p className="text-orange-600 font-semibold">LET'S KICKSTART YOUR FUTURE!</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-6">
          <p className="text-center mb-6">
            Select your preferred <span className="text-orange-500 font-semibold">course</span> and{" "}
            <span className="text-orange-500 font-semibold">city</span> to plan your future.
          </p>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input id="fullName" placeholder="Enter your full name" />
              </div>
              <div>
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mobile">
                  Mobile number <span className="text-red-500">*</span>
                </Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
                    IN (+91)
                  </span>
                  <Input
                    id="mobile"
                    placeholder="Enter 10-digit number"
                    className="rounded-l-none"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="course">
                  Course <span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Search course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="management">Management</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">
                  City <span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Search city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                    <SelectItem value="kolkata">Kolkata</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>
                  Course Type <span className="text-red-500">*</span>
                </Label>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="courseType"
                      value="Online"
                      checked={courseType === "Online"}
                      onChange={(e) => setCourseType(e.target.value)}
                      className="mr-2"
                    />
                    Online
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="courseType"
                      value="Regular"
                      checked={courseType === "Regular"}
                      onChange={(e) => setCourseType(e.target.value)}
                      className="mr-2"
                    />
                    <span className="bg-orange-500 text-white px-2 py-1 rounded text-sm">Regular</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              By submitting this form, you accept and agree to our{" "}
              <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and{" "}
              <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
            </div>

            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg">
              Submit
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
