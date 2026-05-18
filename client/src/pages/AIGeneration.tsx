import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Zap, Check, Smartphone, Monitor, AlertCircle, Edit2, RotateCcw, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type GenerationStep = "analyzing" | "crafting" | "designing" | "optimizing" | "finalizing" | "complete";

export default function AIGeneration() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const [currentStep, setCurrentStep] = useState<GenerationStep>("analyzing");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [progress, setProgress] = useState(0);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCount, setEditCount] = useState(0);
  const [editedHtml, setEditedHtml] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const MAX_EDITS = 5;

  // Parse websiteId from URL
  const params = new URLSearchParams(search);
  const websiteId = params.get("websiteId") ? parseInt(params.get("websiteId")!) : null;

  const steps = [
    { id: "analyzing", label: "Analysing your business...", description: "Understanding your industry and target market" },
    { id: "crafting", label: "Crafting your content...", description: "Generating AI-optimized copy" },
    { id: "designing", label: "Designing your website...", description: "Creating your layout and design" },
    { id: "optimizing", label: "Optimising for AI visibility...", description: "Implementing AVO Lite components" },
    { id: "finalizing", label: "Almost ready...", description: "Final touches and optimization" }
  ];

  // tRPC mutation for AI generation
  const generateMutation = trpc.aiGeneration.generate.useMutation({
    onSuccess: (result) => {
      setGeneratedContent(result.generatedContent);
      setEditedHtml(result.generatedContent.html);
      setEditedTitle(result.generatedContent.metadata.title);
      setEditedDescription(result.generatedContent.metadata.description);
      setCurrentStep("complete");
      setProgress(100);
      setIsGenerating(false);
      setEditCount(0);
      toast.success("Website generated successfully!");
    },
    onError: (error) => {
      console.error("Generation error:", error);
      setError(error.message || "Failed to generate website");
      setIsGenerating(false);
      toast.error(error.message || "Failed to generate website");
    },
  });

  useEffect(() => {
    if (!websiteId) {
      setError("Website ID not found");
      setIsGenerating(false);
      return;
    }

    // Start generation
    generateMutation.mutate({ websiteId });
  }, [websiteId]);

  // Simulate generation progress while waiting for backend
  useEffect(() => {
    if (!isGenerating || currentStep === "complete") return;

    const stepDuration = 2000; // 2 seconds per step
    const stepProgresses = [0, 20, 40, 60, 80];
    let currentStepIndex = 0;

    const interval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        setProgress(stepProgresses[currentStepIndex]);
        setCurrentStep(steps[currentStepIndex].id as GenerationStep);
        currentStepIndex++;
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isGenerating, currentStep]);

  const handleEdit = () => {
    if (editCount >= MAX_EDITS) {
      toast.error(`You've reached the maximum of ${MAX_EDITS} edits`);
      return;
    }
    setIsEditMode(true);
  };

  const handleSaveEdit = () => {
    setEditCount(editCount + 1);
    setIsEditMode(false);
    toast.success(`Edit saved (${editCount + 1}/${MAX_EDITS})`);
  };

  const handleCancelEdit = () => {
    setEditedHtml(generatedContent.html);
    setEditedTitle(generatedContent.metadata.title);
    setEditedDescription(generatedContent.metadata.description);
    setIsEditMode(false);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setCurrentStep("analyzing");
    setProgress(0);
    setEditCount(0);
    setIsEditMode(false);
    generateMutation.mutate({ websiteId: websiteId! });
  };

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
        </div>
      </nav>

      <div className="container py-12">
        {error ? (
          // Error Screen
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Generation Failed</h1>
              <p className="text-muted-foreground mb-6">{error}</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate("/dashboard")} variant="outline">
                  Back to Dashboard
                </Button>
                <Button onClick={() => window.location.reload()} className="bg-accent hover:bg-accent/90">
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        ) : currentStep !== "complete" ? (
          // Loading Screen
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Creating Your AI-Optimized Website
              </h1>
              <p className="text-muted-foreground">
                Our AI is analyzing your business and generating your website. This usually takes 1-2 minutes.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-12">
              <div className="w-full bg-border rounded-full h-2 overflow-hidden mb-4">
                <div 
                  className="bg-accent h-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">{progress}% complete</p>
            </div>

            {/* Generation Steps */}
            <div className="space-y-4">
              {steps.map((step, idx) => {
                const stepIndex = steps.findIndex(s => s.id === currentStep);
                const isCompleted = idx < stepIndex;
                const isCurrent = idx === stepIndex;

                return (
                  <Card 
                    key={step.id}
                    className={`p-4 border-2 transition ${
                      isCompleted ? "border-accent bg-accent/5" :
                      isCurrent ? "border-accent" :
                      "border-border"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted ? "bg-accent text-white" :
                        isCurrent ? "bg-accent/20 text-accent" :
                        "bg-border text-muted-foreground"
                      }`}>
                        {isCompleted ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-bold">{idx + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${isCurrent ? "text-accent" : ""}`}>
                          {step.label}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          // Completion Screen
          <div>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-accent" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Your Website is Ready!
                </h1>
                <p className="text-muted-foreground">
                  Preview your AI-generated website below. You can make up to {MAX_EDITS} edits or regenerate completely.
                </p>
              </div>

              {/* Website Preview */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                {/* Preview Area */}
                <div className="md:col-span-3">
                  <Card className="border border-border overflow-hidden">
                    {/* Device Toggle */}
                    <div className="flex gap-2 p-4 border-b border-border bg-muted/50 justify-between items-center">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPreviewMode("desktop")}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                            previewMode === "desktop"
                              ? "bg-accent text-white"
                              : "bg-background text-foreground hover:bg-muted"
                          }`}
                        >
                          <Monitor className="w-4 h-4" />
                          Desktop
                        </button>
                        <button
                          onClick={() => setPreviewMode("mobile")}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                            previewMode === "mobile"
                              ? "bg-accent text-white"
                              : "bg-background text-foreground hover:bg-muted"
                          }`}
                        >
                          <Smartphone className="w-4 h-4" />
                          Mobile
                        </button>
                      </div>
                      <div className="flex gap-2">
                        {!isEditMode && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={handleEdit}
                              disabled={editCount >= MAX_EDITS}
                            >
                              <Edit2 className="w-4 h-4 mr-2" />
                              Edit ({editCount}/{MAX_EDITS})
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={handleRegenerate}
                            >
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Regenerate
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Website Preview - Iframe or Edit Mode */}
                    {isEditMode ? (
                      <div className="p-6 space-y-4 bg-background">
                        <div>
                          <Label htmlFor="title">Website Title</Label>
                          <Input
                            id="title"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            placeholder="Website title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Meta Description</Label>
                          <Input
                            id="description"
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            placeholder="Meta description"
                          />
                        </div>
                        <div>
                          <Label htmlFor="html">HTML/CSS</Label>
                          <Textarea
                            id="html"
                            value={editedHtml}
                            onChange={(e) => setEditedHtml(e.target.value)}
                            placeholder="Edit your website HTML/CSS"
                            rows={15}
                            className="font-mono text-sm"
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" onClick={handleCancelEdit}>
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                          <Button onClick={handleSaveEdit} className="bg-accent hover:bg-accent/90">
                            <Save className="w-4 h-4 mr-2" />
                            Save Edit
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className={`bg-white text-black ${previewMode === "mobile" ? "max-w-sm mx-auto" : ""}`}>
                        <iframe
                          srcDoc={editedHtml}
                          title="Website Preview"
                          className="w-full h-screen border-0"
                          sandbox="allow-same-origin"
                        />
                      </div>
                    )}
                  </Card>
                </div>

                {/* Stats & Actions */}
                <div className="space-y-6">
                  {/* AVO Score */}
                  <Card className="p-6 border border-border">
                    <h3 className="font-semibold mb-4">AI Visibility Score</h3>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-accent mb-2">
                        {generatedContent?.avoScore || 85}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {(generatedContent?.avoScore || 85) >= 80 ? "Excellent" : (generatedContent?.avoScore || 85) >= 60 ? "Good" : "Fair"} optimization
                      </p>
                    </div>
                  </Card>

                  {/* Edit Counter */}
                  <Card className="p-6 border border-border bg-accent/5">
                    <h3 className="font-semibold mb-4">Edits Remaining</h3>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-accent mb-2">
                        {MAX_EDITS - editCount}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        of {MAX_EDITS} edits available
                      </p>
                    </div>
                  </Card>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <Button className="w-full bg-accent hover:bg-accent/90" onClick={() => navigate(`/checkout?websiteId=${websiteId}`)}>
                      <Zap className="w-4 h-4 mr-2" />
                      Upgrade & Go Live
                    </Button>
                    <Button className="w-full" variant="outline" onClick={() => navigate("/dashboard")}>
                      Back to Dashboard
                    </Button>
                  </div>

                  {/* Features */}
                  <Card className="p-4 border border-border bg-accent/5">
                    <h4 className="font-semibold mb-3 text-sm">AVO Lite Features</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-accent" />
                        <span>robots.txt</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-accent" />
                        <span>llms.txt</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-accent" />
                        <span>Schema Markup</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-accent" />
                        <span>SEO Optimized</span>
                      </li>
                    </ul>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
