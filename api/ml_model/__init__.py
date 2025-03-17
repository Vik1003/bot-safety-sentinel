# This file makes the ml_model directory a Python package 

# ML Model package for the URL Safety Sentinel
"""This package contains the machine learning models for the URL Safety Sentinel.""" 

# ML Model package initialization
"""This package contains the machine learning models and utilities for URL analysis."""

from .stack_ensemble import StackEnsembleModel

__version__ = "0.1.0"
__all__ = ['StackEnsembleModel'] 