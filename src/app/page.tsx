import Link from "next/link";
import { Wrench } from "lucide-react";
import { AdvancedSearchBar } from "@/components/public/AdvancedSearchBar";
import { Flex, Box, Heading, Text, Container } from "@radix-ui/themes";

export default function Home() {
  return (
    <Flex direction="column" position="relative" style={{ minHeight: '100dvh' }}>
      {/* Top right Admin Link */}
      <Box position="absolute" style={{ top: '1rem', right: '1rem', zIndex: 10 }}>
        <Link 
          href="/admin" 
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
        >
          Admin
        </Link>
      </Box>

      {/* Centered Main Content */}
      <Flex direction="column" align="center" justify="center" p="4" style={{ flex: 1, marginTop: '-5rem' }}>
        <Flex direction="column" align="center" mb="7" style={{ textAlign: 'center' }}>
          <Box p="4" mb="6" style={{ backgroundColor: 'var(--accent-a3)', borderRadius: 'var(--radius-6)' }}>
            <Wrench className="h-12 w-12" style={{ color: 'var(--accent-11)' }} />
          </Box>
          <Heading size="9" mb="2" weight="bold" style={{ letterSpacing: '-0.02em' }}>
            AutoParts<span style={{ color: 'var(--accent-11)' }}>Pro</span>
          </Heading>
          <Text size="5" color="gray">
            Find exactly what you need.
          </Text>
        </Flex>

        <Container size="3">
          <AdvancedSearchBar />
        </Container>
      </Flex>
    </Flex>
  );
}
