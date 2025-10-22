export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'elite_master' | 'super_admin' | 'aps_admin' | 'cs_admin' | 'pes_admin' | 'procomm_admin' | 'sps_admin' | 'participant';
  phone?: string;
}

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Elite Master",
    email: "elite@ieee.org",
    password: "elite123",
    role: "elite_master",
    phone: "9876543210"
  },
  {
    id: 2,
    name: "Super Admin",
    email: "super@ieee.org",
    password: "super123",
    role: "super_admin",
    phone: "9876543211"
  },
  {
    id: 3,
    name: "APS Admin",
    email: "aps@ieee.org",
    password: "aps123",
    role: "aps_admin",
    phone: "9876543212"
  },
  {
    id: 4,
    name: "CS Admin",
    email: "cs@ieee.org",
    password: "cs123",
    role: "cs_admin",
    phone: "9876543213"
  },
  {
    id: 5,
    name: "PES Admin",
    email: "pes@ieee.org",
    password: "pes123",
    role: "pes_admin",
    phone: "9876543214"
  },
  {
    id: 6,
    name: "PROCOMM Admin",
    email: "procomm@ieee.org",
    password: "procomm123",
    role: "procomm_admin",
    phone: "9876543215"
  },
  {
    id: 7,
    name: "SPS Admin",
    email: "sps@ieee.org",
    password: "sps123",
    role: "sps_admin",
    phone: "9876543216"
  }
];
