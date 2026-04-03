export function GradientBackground() {
    return (
        <div 
            style={{
                position: "fixed",
                top: "0px",
                left: "0px",
                width: "100vw",
                height: "100vh",
                zIndex: -9999,
                pointerEvents: "none",
                overflow: "hidden"
            }}
        >
            {/* Base Gradient Layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />

            {/* Simple Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]" />

            {/* Animated Gradient Orbs - Hidden on Mobile */}
            <div className="hidden md:block absolute inset-0">
                <div 
                    className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl animate-pulse" 
                    style={{ animationDuration: '8s' }} 
                />
                
                <div 
                    className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse" 
                    style={{ animationDuration: '10s', animationDelay: '2s' }} 
                />
                
                <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-cyan-500/5 to-primary/5 rounded-full blur-3xl animate-pulse" 
                    style={{ animationDuration: '12s', animationDelay: '4s' }} 
                />
                
                <div 
                    className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-gradient-to-bl from-purple-500/5 to-transparent rounded-full blur-3xl animate-pulse" 
                    style={{ animationDuration: '9s', animationDelay: '1s' }} 
                />
            </div>
        </div>
    );
}