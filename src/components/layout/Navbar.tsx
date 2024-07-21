import Link from "next/link";
import Image from 'next/image';
import {Button} from "@/components/ui/button";
import {navLinks} from "@/data/navLinks";
import {ThemeChanger} from "@/app/Theme-changer";
import ConnectButton from "../shared/ConnectButton";


const Navbar = () => {
    return (
        <nav className="py-4 bg-background/30 backdrop-blur-sm">
            <div className="container flex flex-row justify-between items-center">
                <Link href="/">
                        <Image
                            src='/theta.svg' // Path to your logo image in the public directory
                            alt="Logo"
                            width={50} // Adjust width as needed
                            height={10} // Adjust height as needed
                            className="logo-image-class" // Add any necessary Tailwind classes
                        />
                </Link>
                <ul className="md:flex flex-row justify-between gap-8 hidden">
                    {navLinks.map((link) => (
                        <li key={link.title}>
                            <Link href={link.href
                            }>
                                {link.title}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="flex flex-row justify-end space-x-2">
                    <ThemeChanger/>
                    <ConnectButton/>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;