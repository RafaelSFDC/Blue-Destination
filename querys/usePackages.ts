import { useQuery } from '@tanstack/react-query';
import { getPackages } from "@/actions/packages";
export function usePackages() {  return useQuery({
    queryKey: ['packages'],    queryFn: async () => {
      const packages = await getPackages();      return packages;
    },  });
}

export default usePackages;







