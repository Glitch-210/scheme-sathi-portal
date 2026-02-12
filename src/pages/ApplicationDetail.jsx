import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, XCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout/Layout';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore, useApplicationStore } from '@/lib/store';
import { mockApplications } from '@/data/applicationData';
import { useMemo } from 'react';

const statusColors = {
    submitted: 'bg-blue-100 text-blue-700 border-blue-200',
    'in-review': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    approved: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
};

const statusLabels = {
    submitted: 'submitted',
    'in-review': 'inReview',
    approved: 'approved',
    rejected: 'rejected',
};

const ApplicationTimeline = ({ timeline }) => {
    if (!timeline || timeline.length === 0) return null;

    return (
        <div className="relative border-l-2 border-muted ml-3 space-y-6 pb-2">
            {timeline.map((step, index) => (
                <div key={index} className="ml-6 relative">
                    {/* Dot */}
                    <div className={`absolute -left-[31px] bg-background rounded-full p-1 border-2 ${step.status === 'completed' ? 'border-primary text-primary' :
                        step.status === 'current' ? 'border-yellow-500 text-yellow-500' :
                            step.status === 'error' ? 'border-destructive text-destructive' :
                                'border-muted text-muted-foreground'
                        }`}>
                        {step.status === 'completed' ? <CheckCircle2 className="h-4 w-4" /> :
                            step.status === 'current' ? <Clock className="h-4 w-4" /> :
                                step.status === 'error' ? <XCircle className="h-4 w-4" /> :
                                    <Circle className="h-4 w-4" />}
                    </div>

                    {/* Content */}
                    <div className={`${step.status === 'pending' ? 'opacity-50' : ''}`}>
                        <p className="font-medium text-sm leading-none">{step.label}</p>
                        {step.date && <p className="text-xs text-muted-foreground mt-1">{new Date(step.date).toLocaleDateString()}</p>}
                    </div>
                </div>
            ))}
        </div>
    );
};

const ApplicationDetail = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const { user, isAuthenticated } = useAuthStore();
    const { getApplicationsByUser } = useApplicationStore();

    const selectedApp = useMemo(() => {
        if (!user) return null;
        const userApps = getApplicationsByUser(user.id);
        const allApps = [...userApps, ...mockApplications];
        return allApps.find(app => app.id === id);
    }, [id, user, getApplicationsByUser]);

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    if (!selectedApp) {
        return (
            <Layout>
                <div className="container py-10 text-center">
                    <h2 className="text-xl font-semibold mb-4">Application Not Found</h2>
                    <Link to="/applications">
                        <Button>Back to Applications</Button>
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container py-6 md:py-10">
                <div className="max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-300">
                    <Link to="/applications">
                        <Button variant="ghost" size="sm" className="gap-2 mb-6">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Applications
                        </Button>
                    </Link>

                    <Card className="overflow-hidden">
                        <CardHeader className="bg-muted/30 border-b pb-6">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold border ${statusColors[selectedApp.status] || statusColors.submitted}`}>
                                            {t(statusLabels[selectedApp.status] || 'submitted')}
                                        </span>
                                    </div>
                                    <CardTitle className="text-2xl">{selectedApp.serviceName}</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Application ID: <span className="font-mono font-medium text-foreground">{selectedApp.id}</span>
                                    </p>
                                </div>
                                <div className="text-right hidden md:block">
                                    <p className="text-sm text-muted-foreground">Applied on</p>
                                    <p className="font-medium">{new Date(selectedApp.dateApplied).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid md:grid-cols-2 gap-10">
                                {/* Timeline Section */}
                                <div>
                                    <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                                        <div className="h-5 w-1 bg-primary rounded-full" />
                                        Application Status
                                    </h3>
                                    {selectedApp.timeline ? (
                                        <ApplicationTimeline timeline={selectedApp.timeline} />
                                    ) : (
                                        <ApplicationTimeline timeline={[
                                            { label: 'Application Submitted', date: selectedApp.dateApplied, status: 'completed' },
                                            { label: 'Under Review', date: null, status: 'current' },
                                            { label: 'Decision Pending', date: null, status: 'pending' }
                                        ]} />
                                    )}
                                </div>

                                {/* Details Section */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-4">Applicant Details</h3>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between py-2 border-b border-muted">
                                                <span className="text-muted-foreground">Full Name</span>
                                                <span className="font-medium">{selectedApp.formData?.fullName || user.fullName}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-muted">
                                                <span className="text-muted-foreground">Mobile</span>
                                                <span className="font-medium">{selectedApp.formData?.mobile || user.mobile}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-muted">
                                                <span className="text-muted-foreground">Category</span>
                                                <span className="font-medium capitalize">{selectedApp.category || 'General'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50">
                                        <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2 text-sm">Need Help?</h4>
                                        <p className="text-xs text-blue-600 dark:text-blue-400">
                                            If you have questions about your application status, please contact the helpline or visit the nearest facilitation center.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-8 p-4 bg-muted/50 rounded-lg text-xs text-muted-foreground text-center">
                        <p>Disclaimer: Status information is for reference only. Final decisions are made by the concerned government department.</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ApplicationDetail;
