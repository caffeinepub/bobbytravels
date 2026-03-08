import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { Lock, Mail, Phone, Search, Shield, Users } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

interface StoredUser {
  email: string;
  passwordHash: string;
  name: string;
  phone?: string;
  isAdmin: boolean;
  registeredAt: number;
}

function formatDate(ms: number): string {
  return new Date(ms).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function UserRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-40" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-28" />
      </TableCell>
    </TableRow>
  );
}

export function UsersPage() {
  const { session, getAllUsers } = useAuth();
  const [search, setSearch] = useState("");
  const isAdmin = session?.isAdmin === true;

  const allUsers = useMemo<StoredUser[]>(() => {
    if (!isAdmin) return [];
    return getAllUsers();
  }, [isAdmin, getAllUsers]);

  const filtered = useMemo(() => {
    if (!search.trim()) return allUsers;
    const q = search.toLowerCase();
    return allUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone?.includes(q),
    );
  }, [allUsers, search]);

  if (!isAdmin) {
    return (
      <main
        data-ocid="users.page"
        className="min-h-screen bg-sky-pale pt-24 pb-16"
      >
        <div className="max-w-md mx-auto px-4 text-center mt-20">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-display font-bold text-2xl text-foreground mb-2">
            Admin Access Required
          </h2>
          <p className="text-muted-foreground font-ui text-sm leading-relaxed">
            The user management dashboard is only available to administrators.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      data-ocid="users.page"
      className="min-h-screen bg-sky-pale pt-24 pb-16"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display font-bold text-3xl text-foreground">
                User <span className="text-navy">Management</span>
              </h1>
              <p className="text-muted-foreground font-ui text-sm mt-1">
                All registered accounts on BobbyTravels
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-sm font-display font-semibold px-4 py-1.5 rounded-full border-navy/20 text-navy"
            >
              <Users className="w-4 h-4 mr-1.5" />
              {allUsers.length} user{allUsers.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </motion.div>

        {/* Search */}
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            data-ocid="users.search_input"
            placeholder="Search by name, email or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 rounded-xl pl-9"
          />
        </div>

        {/* Desktop table */}
        <div className="hidden md:block">
          <Card className="border-0 shadow-flight rounded-2xl overflow-hidden">
            <Table data-ocid="users.table">
              <TableHeader>
                <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                  <TableHead className="font-ui font-semibold text-foreground py-3.5 pl-5">
                    Name
                  </TableHead>
                  <TableHead className="font-ui font-semibold text-foreground py-3.5">
                    Email
                  </TableHead>
                  <TableHead className="font-ui font-semibold text-foreground py-3.5">
                    Phone
                  </TableHead>
                  <TableHead className="font-ui font-semibold text-foreground py-3.5">
                    Role
                  </TableHead>
                  <TableHead className="font-ui font-semibold text-foreground py-3.5 pr-5">
                    Registered
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allUsers.length === 0 ? (
                  <>
                    <UserRowSkeleton />
                    <UserRowSkeleton />
                    <UserRowSkeleton />
                  </>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-12 font-ui"
                      data-ocid="users.empty_state"
                    >
                      No users match your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((user, index) => (
                    <TableRow
                      key={user.email}
                      data-ocid={`users.row.${index + 1}`}
                      className="hover:bg-secondary/30 transition-colors"
                    >
                      <TableCell className="font-display font-semibold text-sm text-foreground pl-5 py-4">
                        {user.name}
                      </TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${user.email}`}
                          className="text-sm font-ui text-navy hover:text-navy-light transition-colors flex items-center gap-1.5"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          {user.email}
                        </a>
                      </TableCell>
                      <TableCell className="text-sm font-ui text-muted-foreground">
                        {user.phone ? (
                          <a
                            href={`tel:${user.phone}`}
                            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {user.phone}
                          </a>
                        ) : (
                          <span className="text-border">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.isAdmin ? (
                          <Badge className="bg-gold text-navy-dark text-xs font-ui font-semibold px-2 py-0.5 rounded-full border-0">
                            <Shield className="w-3 h-3 mr-1" />
                            Admin
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-xs font-ui text-muted-foreground border-border/60 rounded-full"
                          >
                            Member
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-ui text-muted-foreground pr-5">
                        {formatDate(user.registeredAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {allUsers.length === 0 ? (
            <>
              {[1, 2, 3].map((i) => (
                <Card
                  key={i}
                  className="rounded-2xl border border-border/60 bg-white"
                >
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-24" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : filtered.length === 0 ? (
            <div
              data-ocid="users.empty_state"
              className="text-center text-muted-foreground py-12 font-ui"
            >
              No users match your search.
            </div>
          ) : (
            filtered.map((user, index) => (
              <motion.div
                key={user.email}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                data-ocid={`users.item.${index + 1}`}
              >
                <Card className="rounded-2xl border border-border/60 bg-white shadow-sm">
                  <CardHeader className="pb-2 pt-4 px-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-display font-bold text-sm text-foreground">
                        {user.name}
                      </p>
                      {user.isAdmin ? (
                        <Badge className="bg-gold text-navy-dark text-xs font-ui font-semibold px-2 py-0.5 rounded-full border-0">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-xs font-ui text-muted-foreground border-border/60 rounded-full"
                        >
                          Member
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 space-y-2">
                    <a
                      href={`mailto:${user.email}`}
                      className="text-xs font-ui text-navy hover:text-navy-light transition-colors flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {user.email}
                    </a>
                    {user.phone && (
                      <a
                        href={`tel:${user.phone}`}
                        className="text-xs font-ui text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {user.phone}
                      </a>
                    )}
                    <p className="text-xs text-muted-foreground font-ui">
                      Joined {formatDate(user.registeredAt)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
