import { getHomePageData } from "@/lib/strapi"
import { HeroSection } from "@/components/heroSection"

export async function generateMetadata() {
  const dataHome = await getHomePageData()
  const { title, description } = dataHome || { title: "Home", description: "home page" }

  return {
    title,
    description,
  }
}

export default async function Home() {
  const dataHome = await getHomePageData()
  const { sections } = dataHome || {}

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      {sections?.[0] && (
        <HeroSection data={sections?.[0]} />
      )}
    </main>
  )
}
