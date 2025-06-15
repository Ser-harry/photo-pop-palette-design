
import { MessageCircle, User, Star, BookOpen, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ChatSignInPrompt = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Target,
      title: "Personalized Recommendations",
      description: "Get college suggestions tailored to your preferences"
    },
    {
      icon: BookOpen,
      title: "Save Chat History",
      description: "Access your previous conversations anytime"
    },
    {
      icon: Star,
      title: "Priority Support",
      description: "Get faster and more detailed responses"
    }
  ];

  return (
    <div className="p-6 text-center space-y-6">
      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto">
        <MessageCircle className="w-8 h-8 text-white" />
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Sign In Required</h3>
        <p className="text-gray-600 text-sm">
          Please sign in to access our AI college assistant and get personalized help
        </p>
      </div>

      <div className="space-y-3">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start gap-3 text-left">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <benefit.icon size={16} className="text-orange-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800 text-sm">{benefit.title}</h4>
              <p className="text-gray-600 text-xs">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>

      <Button 
        onClick={() => navigate('/auth')}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
      >
        <User size={16} className="mr-2" />
        Sign In to Continue
      </Button>

      <p className="text-xs text-gray-500">
        New to CollegeSera? Signing in will create your account automatically.
      </p>
    </div>
  );
};

export default ChatSignInPrompt;
