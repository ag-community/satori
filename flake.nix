{
  description = "satori - adrenaline gamer rating frontend (rsbuild + yarn)";

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
          nodejs_24
          yarn
          biome
        ];

        shellHook = ''
          export BIOME_BINARY="$(command -v biome)"

          echo "satori dev shell"
          echo "  yarn install"
          echo "  yarn dev"
          echo "  yarn build"
          echo "  yarn preview"
          echo "  yarn typecheck"
          echo "  yarn lint"
          echo "  yarn format"
          echo "  yarn check"
        '';
      };
    };
}
