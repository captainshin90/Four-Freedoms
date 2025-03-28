"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Home } from "lucide-react";

///////////////////////////////////////////////////////////////////////////////
// Profile page
///////////////////////////////////////////////////////////////////////////////
export default function ProfilePage() {
  const { user, userProfile, updateUserProfile, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Payment states
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpire, setCardExpire] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardCity, setCardCity] = useState("");

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      router.push("/login");
    }
    
    // Populate form with user data
    if (userProfile) {
      setFirstName(userProfile.first_name || "");
      setLastName(userProfile.last_name || "");
      setEmail(userProfile.email1 || "");
      setPhone(userProfile.phone || "");
      
      // Payment info
      setCardName(userProfile.card_name || "");
      setCardNumber(userProfile.card_number || "");
      setCardExpire(userProfile.card_expire || "");
      setCardCvv(userProfile.card_cvv || "");
      setCardCity(userProfile.card_city || "");
    }
  }, [loading, user, userProfile, router]);

  ///////////////////////////////////////////////////////////////////////////////
  // Handle profile update
  ///////////////////////////////////////////////////////////////////////////////
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await updateUserProfile({
        first_name: firstName,
        last_name: lastName,
        phone: phone,
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "An error occurred while updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////
  // Handle payment update
  ///////////////////////////////////////////////////////////////////////////////
  const handlePaymentUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await updateUserProfile({
        card_name: cardName,
        card_number: cardNumber,
        card_expire: cardExpire,
        card_cvv: cardCvv,
        card_city: cardCity,
      });
      
      toast({
        title: "Payment information updated",
        description: "Your payment information has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "An error occurred while updating your payment information.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////
  // Render profile page
  /////////////////////////////////////////////////////////////////////////////// 
  if (loading) {
    return <div className="container py-10">Loading...</div>;
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage 
                src={userProfile?.avatar || user?.photoURL || undefined} 
                alt={`${userProfile?.first_name || user?.displayName || 'User'}'s avatar`}
              />
              <AvatarFallback>
                {userProfile?.first_name?.charAt(0)}{userProfile?.last_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{userProfile?.first_name} {userProfile?.last_name}</h1>
              <p className="text-muted-foreground">{userProfile?.email1}</p>
              <p className="text-sm text-muted-foreground">
                Subscription: {userProfile?.subscription_type || "Free"}
              </p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <form onSubmit={handleProfileUpdate}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed. Contact support for assistance.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Update Profile"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.push('/')}>
                    Cancel
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Current Plan</h3>
                      <p className="text-xl font-bold">{userProfile?.subscription_type || "Free"}</p>
                    </div>
                    <Button variant="outline">Upgrade</Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Free</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold mb-4">$0</p>
                      <ul className="space-y-2">
                        <li>• Basic podcast access</li>
                        <li>• Limited chat functionality</li>
                        <li>• Ad-supported experience</li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" disabled={userProfile?.subscription_type === "free"}>
                        {userProfile?.subscription_type === "free" ? "Current Plan" : "Select Plan"}
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Premium</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold mb-4">$9.99/mo</p>
                      <ul className="space-y-2">
                        <li>• Full podcast library</li>
                        <li>• Advanced chat features</li>
                        <li>• Ad-free experience</li>
                        <li>• Personalized recommendations</li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" disabled={userProfile?.subscription_type === "premium"}>
                        {userProfile?.subscription_type === "premium" ? "Current Plan" : "Select Plan"}
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Enterprise</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold mb-4">$29.99/mo</p>
                      <ul className="space-y-2">
                        <li>• Everything in Premium</li>
                        <li>• Team collaboration</li>
                        <li>• API access</li>
                        <li>• Priority support</li>
                        <li>• Custom integrations</li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" disabled={userProfile?.subscription_type === "enterprise"}>
                        {userProfile?.subscription_type === "enterprise" ? "Current Plan" : "Select Plan"}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <form onSubmit={handlePaymentUpdate}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="•••• •••• •••• ••••"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardExpire">Expiration Date</Label>
                      <Input
                        id="cardExpire"
                        value={cardExpire}
                        onChange={(e) => setCardExpire(e.target.value)}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardCvv">CVV</Label>
                      <Input
                        id="cardCvv"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardCity">Billing City</Label>
                      <Input
                        id="cardCity"
                        value={cardCity}
                        onChange={(e) => setCardCity(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Update Payment Information"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.push('/')}>
                    Cancel
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}