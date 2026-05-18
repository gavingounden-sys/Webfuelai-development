import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Upload, Zap, Loader2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useImageUpload } from "@/hooks/useImageUpload";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface FormState {
  // Step 1
  businessName: string;
  tagline: string;
  industry: string;
  city: string;
  province: string;
  
  // Step 2
  description: string;
  targetCustomers: string;
  services: string[];
  
  // Step 3
  brandVibe: string;
  
  // Step 4
  primaryColor: string;
  secondaryColor: string;
  
  // Step 5
  phone: string;
  email: string;
  address: string;
  socialMedia: { platform: string; url: string }[];
  
  // Step 6
  logoUrl: string;
  
  // Step 7
  productPhotoUrls: string[];
  businessPhotoUrls: string[];
}

const provinces = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"
];

const industries = [
  "Plumbing", "Electrical", "Cleaning", "Consulting", "Retail",
  "Healthcare", "Education", "Technology", "Finance", "Real Estate",
  "Hospitality", "Transportation", "Manufacturing", "Other"
];

const brandVibes = ["Professional", "Friendly", "Bold", "Elegant", "Energetic"];

const primaryColors = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Light Grey", hex: "#D3D3D3" }
];

const secondaryColors = [
  { name: "Red", hex: "#FF0000" },
  { name: "Blue", hex: "#0066CC" },
  { name: "Green", hex: "#228B22" },
  { name: "Custom", hex: "custom" }
];

export default function WebsiteBuilder() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [websiteId, setWebsiteId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customSecondaryColor, setCustomSecondaryColor] = useState("#FF3800");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { uploadImage: uploadLogo, isUploading: isUploadingLogo } = useImageUpload();
  const { uploadImage: uploadProductPhoto, isUploading: isUploadingProduct } = useImageUpload();
  const { uploadImage: uploadBusinessPhoto, isUploading: isUploadingBusiness } = useImageUpload();

  const [formData, setFormData] = useState<FormState>({
    businessName: "",
    tagline: "",
    industry: "",
    city: "",
    province: "",
    description: "",
    targetCustomers: "",
    services: ["", "", ""],
    brandVibe: "",
    primaryColor: "",
    secondaryColor: "",
    phone: "",
    email: "",
    address: "",
    socialMedia: [{ platform: "", url: "" }],
    logoUrl: "",
    productPhotoUrls: [],
    businessPhotoUrls: []
  });

  // tRPC mutations
  const createWebsiteMutation = trpc.websites.create.useMutation();
  const submitFormDataMutation = trpc.formData.submit.useMutation();
  const getFormDataQuery = trpc.formData.get.useQuery(
    { websiteId: websiteId || 0 },
    { enabled: !!websiteId }
  );

  // Initialize website on mount
  useEffect(() => {
    const initializeWebsite = async () => {
      try {
        const result = await createWebsiteMutation.mutateAsync({
          businessName: "New Website",
          industry: ""
        });
        setWebsiteId(result.websiteId);
      } catch (error) {
        toast.error("Failed to initialize website");
      }
    };

    initializeWebsite();
  }, []);

  // Load existing form data
  useEffect(() => {
    if (getFormDataQuery.data) {
      const data = getFormDataQuery.data as any;
      const colorPref = data.colorPreference || "";
      const [primaryColor, secondaryColor] = colorPref.split("|");
      
      setFormData(prev => ({
        ...prev,
        businessName: data.businessName || "",
        tagline: data.tagline || "",
        industry: data.industry || "",
        city: data.city || "",
        province: data.province || "",
        description: data.description || "",
        targetCustomers: data.targetCustomers || "",
        services: data.services || ["", "", ""],
        brandVibe: data.brandVibe || "",
        primaryColor: primaryColor || "",
        secondaryColor: secondaryColor || "",
        phone: data.phone || "",
        email: data.email || "",
        address: data.address || "",
        socialMedia: data.socialMedia ? Object.entries(data.socialMedia).map(([platform, url]: any) => ({ platform, url: url as string })) : [{ platform: "", url: "" }],
        logoUrl: data.logoUrl || "",
        productPhotoUrls: data.productImageUrls || [],
        businessPhotoUrls: data.photoUrls || []
      }));
    }
  }, [getFormDataQuery.data]);

  const handleInputChange = (field: keyof FormState, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (index: number, value: string) => {
    const newServices = [...formData.services];
    newServices[index] = value;
    setFormData(prev => ({ ...prev, services: newServices }));
  };

  const addSocialMedia = () => {
    setFormData(prev => ({
      ...prev,
      socialMedia: [...prev.socialMedia, { platform: "", url: "" }]
    }));
  };

  const handleSocialMediaChange = (index: number, field: "platform" | "url", value: string) => {
    const newSocialMedia = [...formData.socialMedia];
    newSocialMedia[index] = { ...newSocialMedia[index], [field]: value };
    setFormData(prev => ({ ...prev, socialMedia: newSocialMedia }));
  };

  const handleLogoUpload = async (file: File) => {
    try {
      const url = await uploadLogo(file);
      if (url) {
        handleInputChange("logoUrl", url);
        toast.success("Logo uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload logo");
    }
  };

  const handleProductPhotoUpload = async (file: File) => {
    if (formData.productPhotoUrls.length >= 10) {
      toast.error("Maximum 10 product photos allowed");
      return;
    }
    try {
      const url = await uploadProductPhoto(file);
      if (url) {
        setFormData(prev => ({
          ...prev,
          productPhotoUrls: [...prev.productPhotoUrls, url]
        }));
        toast.success("Product photo uploaded");
      }
    } catch (error) {
      toast.error("Failed to upload product photo");
    }
  };

  const handleBusinessPhotoUpload = async (file: File) => {
    if (formData.businessPhotoUrls.length >= 3) {
      toast.error("Maximum 3 business photos allowed");
      return;
    }
    try {
      const url = await uploadBusinessPhoto(file);
      if (url) {
        setFormData(prev => ({
          ...prev,
          businessPhotoUrls: [...prev.businessPhotoUrls, url]
        }));
        toast.success("Business photo uploaded");
      }
    } catch (error) {
      toast.error("Failed to upload business photo");
    }
  };

  const removeProductPhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      productPhotoUrls: prev.productPhotoUrls.filter((_, i) => i !== index)
    }));
  };

  const removeBusinessPhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      businessPhotoUrls: prev.businessPhotoUrls.filter((_, i) => i !== index)
    }));
  };

  // Helper to build the submit payload - strips base64 data from URLs
  const buildPayload = () => {
    // Only include logoUrl if it's a real URL (not base64)
    const safeLogoUrl = formData.logoUrl && !formData.logoUrl.startsWith("data:") ? formData.logoUrl : "";
    // Filter out any base64 URLs from photo arrays
    const safeProductPhotos = formData.productPhotoUrls.filter(u => !u.startsWith("data:"));
    const safeBusinessPhotos = formData.businessPhotoUrls.filter(u => !u.startsWith("data:"));

    return {
      websiteId: websiteId!,
      businessName: formData.businessName || "",
      tagline: formData.tagline || "",
      industry: formData.industry || "",
      city: formData.city || "",
      province: formData.province || "",
      description: formData.description || "",
      targetCustomers: formData.targetCustomers || "",
      services: formData.services.filter(s => s.trim()),
      brandVibe: formData.brandVibe || "",
      colorPreference: `${formData.primaryColor}|${formData.secondaryColor === "custom" ? customSecondaryColor : formData.secondaryColor}`,
      phone: formData.phone || "",
      email: formData.email || "",
      address: formData.address || "",
      socialMedia: Object.fromEntries(
        formData.socialMedia
          .filter(sm => sm.platform && sm.url)
          .map(sm => [sm.platform, sm.url])
      ),
      logoUrl: safeLogoUrl,
      photoUrls: safeBusinessPhotos,
      productImageUrls: safeProductPhotos,
    };
  };

  const handleNext = async () => {
    if (currentStep === 7) {
      await handleSubmit();
    } else {
      // Save current step data
      try {
        if (websiteId) {
          await submitFormDataMutation.mutateAsync(buildPayload());
        }
        setCurrentStep((prev) => (prev + 1) as Step);
      } catch (error) {
        console.error("Save error:", error);
        // Still advance to next step even if save fails
        setCurrentStep((prev) => (prev + 1) as Step);
        toast.error("Could not save progress, but you can continue");
      }
    }
  };

  const handleSubmit = async () => {
    if (!websiteId) {
      toast.error("Website not initialized");
      return;
    }

    try {
      setIsSubmitting(true);
      await submitFormDataMutation.mutateAsync(buildPayload());
      toast.success("Website information saved! Generating your website...");
      navigate(`/generation?websiteId=${websiteId}`);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit form data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = (currentStep / 7) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">WebfuelAI</span>
          </div>
          <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
            Exit
          </button>
        </div>
      </nav>

      <div className="container py-12 max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">Build Your Website</h1>
            <span className="text-sm text-muted-foreground">Step {currentStep} of 7</span>
          </div>
          <div className="w-full bg-border rounded-full h-2 overflow-hidden">
            <div 
              className="bg-accent h-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <Card className="p-8 border border-border">
          {/* Step 1: Business Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Tell us about your business</h2>
                <p className="text-muted-foreground mb-6">We'll use this information to create your website</p>
              </div>

              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  placeholder="e.g., John's Plumbing Services"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange("businessName", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  placeholder="e.g., Fast, reliable plumbing solutions"
                  value={formData.tagline}
                  onChange={(e) => handleInputChange("tagline", e.target.value)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(ind => (
                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="e.g., Johannesburg"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="province">Province</Label>
                <Select value={formData.province} onValueChange={(value) => handleInputChange("province", value)}>
                  <SelectTrigger id="province">
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map(prov => (
                      <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Business Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Tell us more about your business</h2>
                <p className="text-muted-foreground mb-6">Help us understand what you do</p>
              </div>

              <div>
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your business does..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="targetCustomers">Target Customers</Label>
                <Input
                  id="targetCustomers"
                  placeholder="e.g., Residential and commercial properties"
                  value={formData.targetCustomers}
                  onChange={(e) => handleInputChange("targetCustomers", e.target.value)}
                />
              </div>

              <div>
                <Label className="mb-4 block">Key Services (up to 3)</Label>
                <Tabs defaultValue="service-0" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    {formData.services.map((_, index) => (
                      <TabsTrigger key={index} value={`service-${index}`}>
                        Service {index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {formData.services.map((service, index) => (
                    <TabsContent key={index} value={`service-${index}`}>
                      <Input
                        placeholder={`Enter service ${index + 1}...`}
                        value={service}
                        onChange={(e) => handleServiceChange(index, e.target.value)}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>
          )}

          {/* Step 3: Brand Vibe */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Choose your brand vibe</h2>
                <p className="text-muted-foreground mb-6">How would you describe your brand?</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {brandVibes.map(vibe => (
                  <button
                    key={vibe}
                    onClick={() => handleInputChange("brandVibe", vibe)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.brandVibe === vibe
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    {vibe}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Brand Colors */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Choose your brand colours</h2>
                <p className="text-muted-foreground mb-6">Select two colours: a primary and a secondary</p>
              </div>

              {/* Primary Color Selection */}
              <div>
                <Label className="block mb-4 font-semibold">Primary Colour (Required) *</Label>
                <div className="grid grid-cols-3 gap-4">
                  {primaryColors.map(color => (
                    <button
                      key={color.hex}
                      onClick={() => handleInputChange("primaryColor", color.hex)}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        formData.primaryColor === color.hex
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      <div
                        className="w-12 h-12 rounded border"
                        style={{ backgroundColor: color.hex, borderColor: color.hex === "#FFFFFF" ? "#ccc" : color.hex }}
                      />
                      <span className="text-sm font-medium">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Secondary Color Selection */}
              <div>
                <Label className="block mb-4 font-semibold">Secondary Colour (Required) *</Label>
                <div className="grid grid-cols-4 gap-4">
                  {secondaryColors.map(color => (
                    <button
                      key={color.hex}
                      onClick={() => {
                        handleInputChange("secondaryColor", color.hex);
                        if (color.hex === "custom") {
                          setShowColorPicker(true);
                        }
                      }}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        formData.secondaryColor === color.hex
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      {color.hex === "custom" ? (
                        <div className="w-12 h-12 rounded border-2 border-dashed border-accent flex items-center justify-center">
                          <span className="text-lg">+</span>
                        </div>
                      ) : (
                        <div
                          className="w-12 h-12 rounded"
                          style={{ backgroundColor: color.hex }}
                        />
                      )}
                      <span className="text-sm font-medium">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Picker */}
              {formData.secondaryColor === "custom" && (
                <div>
                  <Label htmlFor="customColor">Custom Colour</Label>
                  <div className="flex gap-2">
                    <Input
                      id="customColor"
                      type="color"
                      value={customSecondaryColor}
                      onChange={(e) => setCustomSecondaryColor(e.target.value)}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      placeholder="#FF3800"
                      value={customSecondaryColor}
                      onChange={(e) => setCustomSecondaryColor(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Contact Information */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Contact information</h2>
                <p className="text-muted-foreground mb-6">How can customers reach you?</p>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+27 10 123 4567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@business.co.za"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  placeholder="123 Main Street, Johannesburg, Gauteng"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label>Social Media Links</Label>
                {formData.socialMedia.map((social, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      placeholder="Platform (e.g., Facebook)"
                      value={social.platform}
                      onChange={(e) => handleSocialMediaChange(index, "platform", e.target.value)}
                    />
                    <Input
                      placeholder="URL"
                      value={social.url}
                      onChange={(e) => handleSocialMediaChange(index, "url", e.target.value)}
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addSocialMedia}
                  className="mt-2"
                >
                  Add Social Media Link
                </Button>
              </div>
            </div>
          )}

          {/* Step 6: Upload Logo */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Upload your logo</h2>
                <p className="text-muted-foreground mb-6">Add your business logo</p>
              </div>

              <div>
                <Label>Logo</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  {formData.logoUrl ? (
                    <div className="space-y-4">
                      <img src={formData.logoUrl} alt="Logo preview" className="w-32 h-32 object-cover mx-auto rounded" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange("logoUrl", "")}
                      >
                        Remove Logo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                      <div>
                        <label className="cursor-pointer">
                          <span className="text-accent font-medium hover:underline">Click to upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                            className="hidden"
                            disabled={isUploadingLogo}
                          />
                        </label>
                        <p className="text-sm text-muted-foreground">JPG, PNG, WebP, GIF (max 5MB)</p>
                      </div>
                      {isUploadingLogo && <Loader2 className="w-5 h-5 animate-spin mx-auto" />}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Upload Photos */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Upload your business photos</h2>
                <p className="text-muted-foreground mb-6">Add photos of your products and business</p>
              </div>

              <Tabs defaultValue="products" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="products">Product Photos (max 10)</TabsTrigger>
                  <TabsTrigger value="business">Business Photos (max 3)</TabsTrigger>
                </TabsList>

                {/* Product Photos Tab */}
                <TabsContent value="products" className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <div className="space-y-4">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                      <div>
                        <label className="cursor-pointer">
                          <span className="text-accent font-medium hover:underline">Click to upload product photos</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleProductPhotoUpload(e.target.files[0])}
                            className="hidden"
                            disabled={isUploadingProduct || formData.productPhotoUrls.length >= 10}
                          />
                        </label>
                        <p className="text-sm text-muted-foreground">JPG, PNG, WebP, GIF (max 5MB)</p>
                        <p className="text-xs text-muted-foreground mt-1">{formData.productPhotoUrls.length}/10 uploaded</p>
                      </div>
                      {isUploadingProduct && <Loader2 className="w-5 h-5 animate-spin mx-auto" />}
                    </div>
                  </div>

                  {formData.productPhotoUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {formData.productPhotoUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img src={url} alt={`Product ${index + 1}`} className="w-full h-24 object-cover rounded" />
                          <button
                            onClick={() => removeProductPhoto(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Business Photos Tab */}
                <TabsContent value="business" className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <div className="space-y-4">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                      <div>
                        <label className="cursor-pointer">
                          <span className="text-accent font-medium hover:underline">Click to upload business photos</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleBusinessPhotoUpload(e.target.files[0])}
                            className="hidden"
                            disabled={isUploadingBusiness || formData.businessPhotoUrls.length >= 3}
                          />
                        </label>
                        <p className="text-sm text-muted-foreground">JPG, PNG, WebP, GIF (max 5MB)</p>
                        <p className="text-xs text-muted-foreground mt-1">{formData.businessPhotoUrls.length}/3 uploaded</p>
                      </div>
                      {isUploadingBusiness && <Loader2 className="w-5 h-5 animate-spin mx-auto" />}
                    </div>
                  </div>

                  {formData.businessPhotoUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {formData.businessPhotoUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img src={url} alt={`Business ${index + 1}`} className="w-full h-24 object-cover rounded" />
                          <button
                            onClick={() => removeBusinessPhoto(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => (prev > 1 ? (prev - 1) as Step : prev))}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              className="bg-accent hover:bg-accent/90 text-white"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {currentStep === 7 ? (
                <>
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                  {isSubmitting ? "Generating..." : "Generate Website"}
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
