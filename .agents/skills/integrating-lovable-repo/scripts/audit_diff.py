r"""
audit_diff.py — Umuman Integration Skills
Bagian dari: .claude/skills/integrating-lovable-repo/scripts/

Fungsi:
Membandingkan komponen, hooks, types, dan pages antara
repo sumber (joy_knot) dan repo utama (umuman).
Output: audit_result.txt di root umuman.

Cara jalankan:
    cd C:\project_umuman\umuman
    python .claude/skills/integrating-lovable-repo/scripts/audit_diff.py

Atau dengan custom path:
    python audit_diff.py --source C:\path\to\joy_knot --target C:\path\to\umuman
"""

import os
import argparse
import json
from datetime import datetime

# ─── DEFAULT PATHS ────────────────────────────────────────────────────────────
DEFAULT_SOURCE = r"C:\project_umuman\joy_knot"
DEFAULT_TARGET = r"C:\project_umuman\umuman"

# ─── FOLDER YANG DIAUDIT ──────────────────────────────────────────────────────
AUDIT_SCOPES = {
    "components": {
        "source": "src/components",
        "target": "src/components",
        "label": "Komponen React"
    },
    "hooks": {
        "source": "src/hooks",
        "target": "src/hooks",
        "label": "Custom Hooks"
    },
    "types": {
        "source": "src/types",
        "target": "src/types",
        "label": "TypeScript Types"
    },
    "pages_or_app": {
        "source": "src/pages",
        "target": "src/app",
        "label": "Pages / App Routes"
    },
    "lib": {
        "source": "src/lib",
        "target": "src/lib",
        "label": "Library / Utils"
    },
    "api": {
        "source": "src/api",
        "target": "src/app/api",
        "label": "API Routes"
    }
}

# ─── EKSTENSI FILE YANG DIAUDIT ───────────────────────────────────────────────
VALID_EXTENSIONS = {".tsx", ".ts", ".js", ".jsx", ".css", ".json"}

# ─── HELPERS ──────────────────────────────────────────────────────────────────
def list_files(base_path: str) -> set:
    """Rekursif list semua file dengan ekstensi valid."""
    result = set()
    if not os.path.exists(base_path):
        return result
    for root, _, files in os.walk(base_path):
        for f in files:
            ext = os.path.splitext(f)[1]
            if ext in VALID_EXTENSIONS:
                full_path = os.path.join(root, f)
                rel = os.path.relpath(full_path, base_path)
                result.add(rel)
    return result


def get_file_size(filepath: str) -> str:
    """Kembalikan ukuran file dalam KB."""
    try:
        size = os.path.getsize(filepath)
        return f"{size / 1024:.1f} KB"
    except Exception:
        return "?"


def read_first_lines(filepath: str, n: int = 5) -> str:
    """Baca n baris pertama file untuk deteksi 'use client', imports, dll."""
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            lines = [f.readline().strip() for _ in range(n)]
        return "\n    ".join(filter(None, lines))
    except Exception:
        return "(tidak bisa dibaca)"


def detect_issues(filepath: str) -> list:
    """Deteksi masalah adaptasi yang perlu diperhatikan."""
    issues = []
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()

        if "react-router-dom" in content:
            issues.append("⚠️  Menggunakan react-router-dom → harus diganti next/link + next/navigation")
        if "import.meta.env.VITE_" in content:
            issues.append("⚠️  Menggunakan VITE env vars → ganti ke process.env.NEXT_PUBLIC_*")
        if "from 'vite'" in content or 'from "vite"' in content:
            issues.append("⚠️  Import dari vite → tidak kompatibel dengan Next.js")
        if "supabase.storage" in content:
            issues.append("⚠️  Menggunakan Supabase Storage → ganti ke local upload /api/upload")
        if ": any" in content or "as any" in content:
            issues.append("⚠️  Menggunakan TypeScript 'any' → harus diganti dengan proper typing")
        if "useState" in content or "useEffect" in content or "onClick" in content:
            if "'use client'" not in content:
                issues.append("⚠️  Perlu 'use client' di baris pertama")
        if "useNavigate" in content:
            issues.append("⚠️  useNavigate → ganti dengan useRouter dari next/navigation")
        if "import.meta" in content:
            issues.append("⚠️  import.meta → tidak valid di Next.js")
        if "<img " in content and "next/image" not in content:
            issues.append("ℹ️   Menggunakan <img> tag → pertimbangkan next/image untuk aset statis")

    except Exception:
        issues.append("❌ Tidak bisa dibaca untuk analisis")

    return issues


# ─── AUDIT PER SCOPE ──────────────────────────────────────────────────────────
def audit_scope(scope_name: str, scope_config: dict, source_root: str, target_root: str) -> dict:
    source_path = os.path.join(source_root, scope_config["source"])
    target_path = os.path.join(target_root, scope_config["target"])

    source_files = list_files(source_path)
    target_files = list_files(target_path)

    only_source = sorted(source_files - target_files)
    only_target = sorted(target_files - source_files)
    in_both = sorted(source_files & target_files)

    return {
        "label": scope_config["label"],
        "source_path": source_path,
        "target_path": target_path,
        "source_exists": os.path.exists(source_path),
        "target_exists": os.path.exists(target_path),
        "only_source": only_source,
        "only_target": only_target,
        "in_both": in_both,
        "total_source": len(source_files),
        "total_target": len(target_files),
    }


def audit_dependencies(source_root: str, target_root: str) -> dict:
    """Bandingkan dependencies dari package.json."""
    def read_deps(root):
        pkg_path = os.path.join(root, "package.json")
        try:
            with open(pkg_path, "r", encoding="utf-8") as f:
                pkg = json.load(f)
            deps = {}
            deps.update(pkg.get("dependencies", {}))
            deps.update(pkg.get("devDependencies", {}))
            return deps
        except Exception:
            return {}

    source_deps = read_deps(source_root)
    target_deps = read_deps(target_root)

    vite_specific = {
        "vite", "react-router-dom", "@vitejs/plugin-react",
        "@vitejs/plugin-react-swc", "react-scripts", "@vite/client"
    }

    only_source = {}
    for pkg, ver in source_deps.items():
        if pkg not in target_deps:
            flag = "🚫 SKIP" if pkg in vite_specific else "✅ KANDIDAT INSTALL"
            only_source[pkg] = {"version": ver, "action": flag}

    return {
        "source_total": len(source_deps),
        "target_total": len(target_deps),
        "only_source": only_source
    }


def audit_tailwind(source_root: str, target_root: str) -> dict:
    """Cek apakah kedua repo punya tailwind config."""
    source_tw = os.path.join(source_root, "tailwind.config.ts")
    target_tw = os.path.join(target_root, "tailwind.config.ts")
    return {
        "source_exists": os.path.exists(source_tw),
        "target_exists": os.path.exists(target_tw),
        "source_path": source_tw,
        "target_path": target_tw,
    }


# ─── GENERATE REPORT ──────────────────────────────────────────────────────────
def generate_report(source_root: str, target_root: str, output_file: str):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    lines = []

    lines.append("=" * 70)
    lines.append("  UMUMAN — AUDIT DIFF REPORT")
    lines.append(f"  Dibuat: {timestamp}")
    lines.append(f"  Source (joy_knot): {source_root}")
    lines.append(f"  Target (umuman):   {target_root}")
    lines.append("=" * 70)

    # ── 1. Audit per scope ───────────────────────────────────────────────
    lines.append("\n\n[1] AUDIT KOMPONEN, HOOKS, TYPES, PAGES, LIB, API")
    lines.append("-" * 70)

    for scope_name, scope_config in AUDIT_SCOPES.items():
        result = audit_scope(scope_name, scope_config, source_root, target_root)
        lines.append(f"\n▸ {result['label'].upper()}")
        lines.append(f"  Source: {result['source_path']} ({'ada' if result['source_exists'] else 'tidak ada'})")
        lines.append(f"  Target: {result['target_path']} ({'ada' if result['target_exists'] else 'tidak ada'})")
        lines.append(f"  Total di source: {result['total_source']} file")
        lines.append(f"  Total di target: {result['total_target']} file")

        if result["only_source"]:
            lines.append(f"\n  + HANYA DI JOY_KNOT ({len(result['only_source'])} file) → kandidat integrasi:")
            for f in result["only_source"]:
                full_path = os.path.join(source_root, scope_config["source"], f)
                size = get_file_size(full_path)
                issues = detect_issues(full_path)
                lines.append(f"    + {f} ({size})")
                for issue in issues:
                    lines.append(f"      {issue}")

        if result["in_both"]:
            lines.append(f"\n  ~ ADA DI KEDUANYA ({len(result['in_both'])} file) → cek konflik:")
            for f in result["in_both"]:
                source_full = os.path.join(source_root, scope_config["source"], f)
                issues = detect_issues(source_full)
                if issues:
                    lines.append(f"    ~ {f}")
                    for issue in issues:
                        lines.append(f"      {issue}")
                else:
                    lines.append(f"    ~ {f} (ok)")

        if result["only_target"]:
            lines.append(f"\n  - HANYA DI UMUMAN ({len(result['only_target'])} file) → JANGAN SENTUH:")
            for f in result["only_target"]:
                lines.append(f"    - {f}")

    # ── 2. Audit dependencies ────────────────────────────────────────────
    lines.append("\n\n[2] AUDIT DEPENDENCIES (package.json)")
    lines.append("-" * 70)
    dep_result = audit_dependencies(source_root, target_root)
    lines.append(f"  Total deps di joy_knot: {dep_result['source_total']}")
    lines.append(f"  Total deps di umuman:   {dep_result['target_total']}")

    if dep_result["only_source"]:
        lines.append(f"\n  Package hanya di joy_knot ({len(dep_result['only_source'])} package):")
        for pkg, info in dep_result["only_source"].items():
            lines.append(f"    {info['action']}  {pkg}@{info['version']}")
    else:
        lines.append("\n  Tidak ada dependency baru dari joy_knot.")

    # ── 3. Audit Tailwind ────────────────────────────────────────────────
    lines.append("\n\n[3] AUDIT TAILWIND CONFIG")
    lines.append("-" * 70)
    tw = audit_tailwind(source_root, target_root)
    lines.append(f"  tailwind.config.ts di joy_knot: {'✅ ada' if tw['source_exists'] else '❌ tidak ada'}")
    lines.append(f"  tailwind.config.ts di umuman:   {'✅ ada' if tw['target_exists'] else '❌ tidak ada'}")
    if tw["source_exists"] and tw["target_exists"]:
        lines.append("  → Buka keduanya secara manual, merge custom colors/animations/fonts secara additive.")
        lines.append(f"    Source: {tw['source_path']}")
        lines.append(f"    Target: {tw['target_path']}")

    # ── 4. Ringkasan rekomendasi ─────────────────────────────────────────
    lines.append("\n\n[4] RINGKASAN REKOMENDASI")
    lines.append("-" * 70)
    lines.append("""
  LANGKAH SELANJUTNYA SETELAH MEMBACA LAPORAN INI:

  1. Buka audit_result.txt dan baca bagian [1] dengan seksama
  2. Isi tabel pemetaan di AUDIT.md (section D1-D6)
  3. Untuk setiap file di bagian '+' (hanya di joy_knot):
     a. Buka file tersebut
     b. Baca isinya
     c. Tentukan: integrasi langsung / adaptasi / skip
     d. Catat di tabel D2 AUDIT.md
  4. Untuk setiap file di bagian '~' (ada di keduanya):
     a. Bandingkan isinya
     b. Tentukan apakah perlu merge atau biarkan umuman yang berlaku
  5. Install dependency yang ditandai '✅ KANDIDAT INSTALL'
  6. Merge tailwind config secara additive
  7. Baru mulai integrasi kode

  INGAT:
  - File di bagian '-' (hanya di umuman) → JANGAN DISENTUH
  - Ikuti ADAPTATION.md untuk setiap file yang diadaptasi
  - Jalankan: npm run build && npm run type-check setelah selesai
    """)

    lines.append("=" * 70)
    lines.append("  END OF REPORT")
    lines.append("=" * 70)

    # ── Tulis ke file ────────────────────────────────────────────────────
    report_content = "\n".join(lines)
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(report_content)

    return report_content


# ─── MAIN ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Audit diff antara joy_knot dan umuman untuk keperluan integrasi."
    )
    parser.add_argument(
        "--source",
        default=DEFAULT_SOURCE,
        help=f"Path ke repo sumber (joy_knot). Default: {DEFAULT_SOURCE}"
    )
    parser.add_argument(
        "--target",
        default=DEFAULT_TARGET,
        help=f"Path ke repo target (umuman). Default: {DEFAULT_TARGET}"
    )
    parser.add_argument(
        "--output",
        default="audit_result.txt",
        help="Nama file output. Default: audit_result.txt"
    )

    args = parser.parse_args()

    print(f"\nMemulai audit...")
    print(f"Source: {args.source}")
    print(f"Target: {args.target}")
    print(f"Output: {args.output}\n")

    report = generate_report(args.source, args.target, args.output)

    print(f"✅ Audit selesai. Lihat: {args.output}\n")

    # Print ringkasan ke terminal juga
    total_source_only = sum(
        len(audit_scope(k, v, args.source, args.target)["only_source"])
        for k, v in AUDIT_SCOPES.items()
    )
    total_both = sum(
        len(audit_scope(k, v, args.source, args.target)["in_both"])
        for k, v in AUDIT_SCOPES.items()
    )
    total_target_only = sum(
        len(audit_scope(k, v, args.source, args.target)["only_target"])
        for k, v in AUDIT_SCOPES.items()
    )

    print(f"  + Kandidat integrasi (hanya di joy_knot): {total_source_only} file")
    print(f"  ~ Perlu cek konflik (ada di keduanya):    {total_both} file")
    print(f"  - Jangan disentuh (hanya di umuman):      {total_target_only} file")
    print(f"\nBuka {args.output} untuk laporan lengkap.\n")
