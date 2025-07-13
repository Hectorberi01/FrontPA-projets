'use client'
import {DashboardLayout} from "@/components/layout/dashboard-layout"
import GrilleForm from "@/components/notation/GrilleForm"
import {useParams} from "next/navigation"

export default function Page() {
    const { projectId } = useParams()

    return (
        <DashboardLayout>
            <div className="container mx-auto p-6 space-y-6">
                <h1 className="text-2xl font-bold text-center">Création / édition des grilles</h1>
                <GrilleForm projectId={Number(projectId)} />
            </div>
        </DashboardLayout>
    )
}
