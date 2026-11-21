{
  description = "satori - adrenaline gamer rating frontend";

  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";

  outputs =
    { nixpkgs, ... }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          biome
          git
          nodejs_24
          pnpm
        ];

        shellHook = ''
          export BIOME_BINARY="$(command -v biome)"

          echo "satori dev shell"
          echo "  pnpm install"
          echo "  pnpm dev"
          echo "  pnpm build"
          echo "  pnpm check"
          echo "  pnpm test"
          echo "  pnpm format"
          echo "  pnpm lint"
          echo "  pnpm paraglide"
        '';
      };
    };
}
