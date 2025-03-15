
import { useEffect, useRef } from 'react';
import Header from '@/components/Header';
import UrlAnalyzer from '@/components/UrlAnalyzer';
import { ShieldCheck, Link, Bot, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  // Refs for each section to enable smooth scrolling
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const analyzerRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  
  // Set up scroll behavior for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.hash) {
        e.preventDefault();
        const targetId = target.hash.substring(1);
        
        let targetElement: HTMLElement | null = null;
        switch (targetId) {
          case 'features':
            targetElement = featuresRef.current;
            break;
          case 'how-it-works':
            targetElement = howItWorksRef.current;
            break;
          case 'analyzer':
            targetElement = analyzerRef.current;
            break;
          case 'about':
            targetElement = aboutRef.current;
            break;
        }
        
        if (targetElement) {
          const yOffset = -80; // Header height + some padding
          const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="min-h-screen w-full bg-background noise-bg">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="inline-block mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Bot Detection Technology
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-balance">
                Protect Yourself from <span className="text-primary">Malicious Social Bots</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto md:mx-0">
                Our advanced analysis tool uses Learning Automata to detect potentially harmful 
                social bot activity in tweets. Verify before you click.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a 
                  href="#analyzer" 
                  className="px-6 py-3 rounded-lg bg-primary text-white font-medium shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all"
                >
                  Analyze URL Now
                </a>
                <a 
                  href="#how-it-works" 
                  className="px-6 py-3 rounded-lg bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-all"
                >
                  Learn How It Works
                </a>
              </div>
            </div>
            
            <div className="hidden md:block relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl transform rotate-3 scale-95"></div>
              <div className="relative z-10 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/40">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="text-xs text-muted-foreground ml-1">URL Analysis</div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-status-safe/10 border border-status-safe/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <ShieldCheck className="h-5 w-5 text-status-safe" />
                      <span className="font-medium">Safe URL</span>
                    </div>
                    <p className="text-sm">twitter.com/verified_account/status/123456789</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-status-suspicious/10 border border-status-suspicious/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <ShieldCheck className="h-5 w-5 text-status-suspicious" />
                      <span className="font-medium">Suspicious URL</span>
                    </div>
                    <p className="text-sm">t.co/a1b2c3 → unknown-site.com/download</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-status-malicious/10 border border-status-malicious/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <ShieldCheck className="h-5 w-5 text-status-malicious" />
                      <span className="font-medium">Malicious URL</span>
                    </div>
                    <p className="text-sm">t.co/x1y2z3 → click.suspicious-site.net/malware</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background gradient */}
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent -z-10"></div>
      </section>
      
      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Analysis Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our tool analyzes multiple factors to determine if a tweet URL is safe, suspicious, or malicious.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-white shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Link className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">URL Risk Analysis</h3>
              <p className="text-muted-foreground">
                Evaluates URL characteristics like shortening, redirections, domain age, and reputation to identify potential risks.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                  Shortened URL detection
                </li>
                <li className="flex items-center text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                  Redirection chain analysis
                </li>
                <li className="flex items-center text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                  SSL certificate verification
                </li>
              </ul>
            </div>
            
            <div className="p-6 rounded-xl bg-white shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Bot Detection</h3>
              <p className="text-muted-foreground">
                Uses Learning Automata to identify bot-like tweet patterns and suspicious account behavior.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                  Account activity analysis
                </li>
                <li className="flex items-center text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                  Tweet content patterns
                </li>
                <li className="flex items-center text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                  Temporal behavior detection
                </li>
              </ul>
            </div>
            
            <div className="p-6 rounded-xl bg-white shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Risk Assessment</h3>
              <p className="text-muted-foreground">
                Combines multiple signals to calculate an overall risk score and provide detailed analysis explanations.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                  Clear risk classification
                </li>
                <li className="flex items-center text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                  Comprehensive scoring
                </li>
                <li className="flex items-center text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                  Detailed threat explanations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section ref={howItWorksRef} id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our system uses advanced Learning Automata techniques to analyze tweet URLs and detect potential risks.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className={cn(
              "relative",
              "p-6 rounded-xl bg-white shadow-md border border-gray-100",
              "transition-all duration-300 hover:shadow-lg"
            )}>
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">1</div>
              <h3 className="text-lg font-semibold mb-3 mt-2">URL Submission</h3>
              <p className="text-sm text-muted-foreground">
                Enter a tweet URL in the analysis tool. The system extracts the URL components for evaluation.
              </p>
            </div>
            
            <div className={cn(
              "relative", 
              "p-6 rounded-xl bg-white shadow-md border border-gray-100",
              "transition-all duration-300 hover:shadow-lg"
            )}>
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">2</div>
              <h3 className="text-lg font-semibold mb-3 mt-2">Feature Extraction</h3>
              <p className="text-sm text-muted-foreground">
                The system extracts URL-based and tweet-based features for comprehensive analysis.
              </p>
            </div>
            
            <div className={cn(
              "relative", 
              "p-6 rounded-xl bg-white shadow-md border border-gray-100",
              "transition-all duration-300 hover:shadow-lg"
            )}>
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">3</div>
              <h3 className="text-lg font-semibold mb-3 mt-2">LA Processing</h3>
              <p className="text-sm text-muted-foreground">
                Learning Automata algorithm processes the feature set and calculates risk probabilities.
              </p>
            </div>
            
            <div className={cn(
              "relative", 
              "p-6 rounded-xl bg-white shadow-md border border-gray-100",
              "transition-all duration-300 hover:shadow-lg"
            )}>
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">4</div>
              <h3 className="text-lg font-semibold mb-3 mt-2">Risk Classification</h3>
              <p className="text-sm text-muted-foreground">
                Results are presented with a clear Safe, Suspicious, or Malicious classification and detailed explanations.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Analyzer Section */}
      <section ref={analyzerRef} id="analyzer" className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Twitter URL Analyzer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enter a tweet URL to analyze for potential security risks and bot activity.
            </p>
          </div>
          
          <UrlAnalyzer />
        </div>
      </section>
      
      {/* About Section */}
      <section ref={aboutRef} id="about" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">About The Project</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              This project utilizes Learning Automata techniques to detect malicious social bots through URL analysis.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold mb-4">Project Goals</h3>
            <p className="mb-6 text-muted-foreground">
              Our mission is to provide users with a reliable tool to verify tweet URLs before clicking, 
              helping to protect against phishing, malware, and other online threats spread by social bots.
            </p>
            
            <h3 className="text-xl font-semibold mb-4">Technology</h3>
            <p className="mb-6 text-muted-foreground">
              The core of this system is built on Learning Automata, a reinforcement learning technique
              that adapts to evolving threats and improves detection accuracy over time.
            </p>
            
            <h3 className="text-xl font-semibold mb-4">Future Enhancements</h3>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                <span className="text-muted-foreground">Integration with browser extensions for real-time protection</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                <span className="text-muted-foreground">API access for developers to incorporate URL analysis in their applications</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                <span className="text-muted-foreground">Advanced visualization of bot network connections</span>
              </li>
            </ul>
            
            <div className="pt-6 border-t">
              <p className="text-center text-sm text-muted-foreground">
                This is a research project focused on enhancing online safety through advanced bot detection techniques.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-6 border-t bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="font-medium">SocialBotGuard</span>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-4 md:mb-0">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#analyzer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Analyzer</a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
          </nav>
          
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SocialBotGuard
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
